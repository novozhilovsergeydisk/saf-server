'use strict';

const path = require('path');
const Session = require('../../lib/Session/index.js');
const { token, sliceLastSymbol, __MIME } = require('../../helpers');
const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

const parseHost = (host) => {
    if (!host) return 'no-host-name-in-http-headers';
    const portOffset = host.indexOf(':');
    if (portOffset > -1) host = host.substr(0, portOffset);
    return host;
};

class Client {
    // param req.headers.host
    constructor(req, res) {
        this.routeList = require('../../route-list.js');
        let {url, method} = req;
        url  = sliceLastSymbol('/', url);
        const {host} = req.headers;
        const fileExt = path.extname(url).substring(1);
        const mimeType = __MIME[fileExt] || __MIME.html;
        this.req = req;
        this.res = res;
        this.host = parseHost(host);
        this.token = undefined;
        this.session = new Session(token());
        this.cookie = {};
        this.preparedCookie = [];
        this.http_method = method;
        this.url = url;
        this.fileExt = fileExt;
        this.mimeType = mimeType;
    }

    static async getInstance(req, res) {
        return new Client(req, res);
        // const client = new Client(host);
        // await Session.restore(client);
        // return client;
    }

    send(res, text, mimeType, status = 200) {
        res.setHeader('Content-Type', (mimeType === null) ? this.mimeType : mimeType);
        res.statusCode = status;
        res.end(text);
    }

    async getCookie() {
        return this.cookie;
    }

    parseCookie() {
        const { req } = this;
        const { cookie } = req.headers;

        // log({ 'cookie': cookie });

        if (!cookie) return;
        const items = cookie.split(';');
        for (const item of items) {
            const parts = item.split('=');
            const key = parts[0].trim();
            const val = parts[1] || '';
            this.cookie[key] = val.trim();
        }
    }

    setCookie(name, val, httpOnly = false) {
        const { host } = this;
        const expires = `expires=${COOKIE_EXPIRE}`;
        let cookie = `${name}=${val}; ${expires}; Path=/; Domain=${host}`;
        if (httpOnly) cookie += '; HttpOnly';
        this.preparedCookie.push(cookie);
        return this;
    }

    deleteCookie(name) {
        this.preparedCookie.push(name + COOKIE_DELETE + this.host);
        return this;
    }

    sendCookie() {
        const { res, preparedCookie } = this;
        if (preparedCookie.length && !res.headersSent) {
            console.dir({ preparedCookie });
            res.setHeader('Set-Cookie', preparedCookie);
        }
        return this;
    }
}

module.exports = Client;
