'use strict';

const { __VIEWS, log, dump } = require('../../helpers.js');

// dump(__VIEWS())

const nunjucks = require('nunjucks');
nunjucks.configure(__VIEWS(), { autoescape: true });

class Renderer {
    render() {
        //throw Error();
        console.log('Not implemented');
    }
}

class ConsoleRenderer extends Renderer {
    render(data) {
        console.table(data);
    }
}

class WebRenderer extends Renderer {
    render(data) {
        const keys = Object.keys(data[0]);
        const line = (row) => '<tr>' +
            keys.map((key) => `<td>${row[key]}</td>`).join('') +
            '</tr>';
        const output = [
            '<table><tr>',
            keys.map((key) => `<th>${key}</th>`).join(''),
            '</tr>',
            data.map(line).join(''),
            '</table>',
        ];
        console.log(output.join(''));
    }
}

class MarkdownRenderer extends Renderer {
    render(data) {
        const keys = Object.keys(data[0]);
        const line = (row) => '|' +
            keys.map((key) => `${row[key]}`).join('|') + '|\n';
        const output = [
            '|', keys.map((key) => `${key}`).join('|'), '|\n',
            '|', keys.map(() => '---').join('|'), '|\n',
            data.map(line).join(''),
        ];
        console.log(output.join(''));
    }
}

class HTMLRenderer extends Renderer {
    render(data) {
        return data;
    }
}

class NunjuksRenderer extends Renderer {
    render(data, path) {
        log({ '__VIEWS()': __VIEWS() })
        log({ path })
        log({ data })
        return;
        return nunjucks.render(path, data)
    }
}

class Context {
    constructor(renderer) {
        this.renderer = renderer;
    }

    process(data, path) {
        // log({ path })
        // log({ data })

        return this.renderer.render(data, path);
    }
}

// const non = new Context(new Renderer());
const con = new Context(new ConsoleRenderer());
const web = new Context(new WebRenderer());
const mkd = new Context(new MarkdownRenderer());
const htm = new Context(new HTMLRenderer());
const tmpl = new Context(new NunjuksRenderer());

module.exports = { con, web, mkd, htm, tmpl };
