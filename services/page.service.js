import { Readability } from "@mozilla/readability";
import axios from "axios";
import * as cheerio from 'cheerio';
import { JSDOM } from "jsdom";

function getProtocolAndDomain(urlString) {
    try {
        const url = new URL(urlString);
        const protocol = url.protocol.replace(':', ''); // Remove the trailing colon
        const hostname = url.hostname;
        return `${protocol}://${hostname}`; // Combine them into one string
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
        this.imgUrls = [];
        this.downloadedImages = [];
    }

    async loadPage() {
        await this._getPage();
        this._readifyPage();
        this._extractImgUrls();
        await this._downloadImages();
    }

    async _getPage() {
        if (!this.url)
            throw new Error(); // TODO change this to proper error
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
        const $ = cheerio.load(this.html);
        $('img').each((i, el) => {
            const imgUrl = $(el).attr('src');
            if (imgUrl) {
                if (!imgUrl.startsWith(this.hostName)) {
                    const imgFullUrl = this.hostName + imgUrl;
                    this.imgUrls.push([imgUrl, imgFullUrl]);
                }
                else {
                    this.imgUrls.push([imgUrl, null]);
                }
                console.debug("img url pushed", imgUrl);
            }
        });
    }

    async _downloadImages() {
        for (const url of this.imgUrls) {
            const imageUrl = url[1];
            const articleOrigImgPath = url[0];
            try {
                const imgPath = path.join(this.repository, 'images', `image${i}.jpg`);
                console.debug(`Downloading: ${imageUrl} to ${imgPath}`)
                await imageDownloader.image({
                    url: imageUrl,
                    dest: imgPath
                });
                let regex;
                if (articleOrigImgPath) {
                    regex = new RegExp(articleOrigImgPath, 'g');
                } else {
                    regex = new RegExp(imageUrl, 'g');
                }
                this.article.content = this.article.content.replace(regex, imgPath);
                this.downloadedImages.push(imgPath);
            } catch (error) {
                console.log(`Failed to download image: ${imageUrl}`);
            }
        }
    }
}