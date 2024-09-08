import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from 'cheerio';
import { JSDOM } from "jsdom";
import path from 'path';
import imageDownloader from 'image-downloader';
import BadParamsError from "../errors/bad-params.error.js";

function getProtocolAndDomain(urlString) {
    try {
        const url = new URL(urlString);
        const protocol = url.protocol.replace(':', '');
        const hostname = url.hostname;
        return `${protocol}://${hostname}`;
    } catch (error) {
        console.error('Invalid URL', error);
        return null;
    }
}

export class PageService {
    constructor(url, repository) {
        this.url = url;
        this.repository = repository;
        this.html = null;
        this.hostName = null;
        this.article = null;
        this.title = null;
        this.images = [];
        this.downloadedImages = [];
    }

    async loadPage() {
        await this._getPage();
        this._readifyPage();
        this._extractImgUrls();
        await this._downloadImages();
        this._replaceImageUrlsOnArticle();
    }

    async _getPage() {
        if (!this.url)
            throw new BadParamsError("url cannot be null or empty!");
        const response = await axios.get(this.url);
        this.html = response.data;
        this.hostName = getProtocolAndDomain(this.url);
    }

    _readifyPage() {
        const dom = new JSDOM(this.html);
        const reader = new Readability(dom.window.document);
        this.article = reader.parse();
        this.title = this.article.title.trim();

        if (!this.article) {
            throw new Error(); // TODO change this to proper error
        }
    }

    _extractImgUrls() {
        if (!this.hostName) {
            throw new BadParamsError("hostName cannot be null or empty!");
        }

        const $ = cheerio.load(this.html);
        $('img').each((i, el) => {
            const imgUrl = $(el).attr('src');
            if (imgUrl) {
                this.images.push({ url: imgUrl, path: null });
                console.debug("image found:", imgUrl);
            }
        });
    }

    _buildImageUrl(imageUrl) {
        return new URL(imageUrl, this.hostName).href;
    }

    async _downloadImages() {
        const promises = [];

        for (let i = 0; i < this.images.length; i++) {
            const imageUrl = this.images[i].url;
            const imageFullUrl = imageUrl.startsWith(this.hostName) ? imageUrl : this._buildImageUrl(imageUrl);
            const imgPath = path.join(this.repository, 'images', `image${i}.jpg`);
            const downloadPromise = this.downloadImage(imageFullUrl, imgPath);
            this.images[i].path = imgPath;
            promises.push(downloadPromise);
        }

        await Promise.all(promises);
    }

    _replaceImageUrlsOnArticle() {
        for (const image of this.images) {
            const regex = new RegExp(image.url, 'g');
            console.debug("replacing ", image.url, " with ", image.path);
            this.article.content = this.article.content.replace(regex, image.path);
        }
    }

    async downloadImage(imageUrl, imgPath) {
        console.debug(`Downloading: ${imageUrl} to ${imgPath}`);
        await imageDownloader.image({
            url: imageUrl,
            dest: imgPath
        });
        this.downloadedImages.push(imgPath);
    }
}