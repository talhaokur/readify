import { Readability } from "@mozilla/readability";
import axios from "axios";
import imageDownloader from 'image-downloader';
import { JSDOM } from "jsdom";
import path from 'path';
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
    constructor(pages, repository) {
        this.pages = pages;
        this.repository = repository;
    }

    async loadPages() {
        if (!this.pages)
            throw new BadParamsError("pages cannot be null!");

        if (this.pages.length === 0)
            throw new BadParamsError("pages length should be greather than 0!");

        const promises = []

        for (const page of this.pages) {
            const event = this._loadEvent(page);
            promises.push(event);
        }

        await Promise.all(promises).catch(error => {
            console.error("error happened during loading pages: ", error);
        });
    }

    async _loadEvent(page) {
        await this._getPage(page);
        this._readifyPage(page);
        this._extractImgUrls(page);
        await this._downloadImages(page);
        this._replaceImageUrlsOnArticle(page);
    }

    async _getPage(page) {
        if (!page.url)
            throw new BadParamsError("url cannot be null or empty!");
        const response = await axios.get(page.url);
        page.html = response.data;
        page.hostName = getProtocolAndDomain(page.url);
    }

    _readifyPage(page) {
        const dom = new JSDOM(page.html);
        const reader = new Readability(dom.window.document);
        page.article = reader.parse();
        page.title = page.article.title.trim();
    }

    _extractImgUrls(page) {
        if (!page.html) {
            throw new BadParamsError("page's html cannot be null or empty!");
        }

        const dom = new JSDOM(page.html);
        dom.window.document.querySelectorAll('img').forEach((el) => {
            const imgUrlOriginal = el.getAttribute('src');
            let imgUrl = imgUrlOriginal;

            if (imgUrl.startsWith('/')) {
                const siteRootUrl = new URL('/', page.url).origin;
                imgUrl = siteRootUrl + imgUrl;
            } else {
                imgUrl = new URL(imgUrl, page.url).href;
            }

            page.images.push({ url: imgUrl, originalUrl: imgUrlOriginal, path: null });
        });
    }

    _buildImageUrl(imageUrl) {
        return new URL(imageUrl, this.hostName).href;
    }

    _getFileNameFromPathWithRandomChars(path, length) {
        if (!path)
            return "";
        const fileName = path.split('/').pop().split('.').slice(0, -1).join('.');
        const randomChars = Math.random().toString(36).substring(2, 2 + length);

        return `${fileName}-${randomChars}`;
    }

    async _downloadImages(page) {
        const promises = [];

        for (const image of page.images) {
            const newImageName = this._getFileNameFromPathWithRandomChars(image.url, 10);
            image.path = path.join(this.repository, 'images', `${newImageName}.jpg`);
            const downloadPromise = this.downloadImage(image);
            promises.push(downloadPromise);
        }

        await Promise.all(promises);
    }

    _replaceImageUrlsOnArticle(page) {
        for (const image of page.images) {
            const regex = new RegExp(image.originalUrl, 'g');
            console.debug("replacing ", image.originalUrl, " with ", image.path);
            page.article.content = page.article.content.replace(regex, image.path);
        }
    }

    async downloadImage(image) {
        console.debug(`Downloading: ${image.url} to ${image.path}`);
        await imageDownloader.image({
            url: image.url,
            dest: image.path
        });
    }

    getAllContent() {
        const contents = [];

        this.pages.forEach(page => {
            contents.push({
                title: page.title,
                data: `<div class="chapter">${page.article}<div>`
            });
        });

        return contents;
    }
}