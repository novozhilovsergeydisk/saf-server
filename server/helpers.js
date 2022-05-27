'use strict';

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const crypto = require('crypto');
const {Client} = require('pg');
const {mail} = require('./lib/Mailer/index.js');
const {STATIC_PATH, VIEWS_PATH, APP_PATH, SERVER_PATH, STORAGE_PATH, UPLOAD_PATH, MIME_TYPES, ALLOWED_METHODS} = require('../constants.js');
const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

// console.log({ 'process.cwd()': process.cwd() })

const httpMethods = () => {
    return ALLOWED_METHODS;
};

const isAllowed = (method) => {
    return ALLOWED_METHODS.indexOf(method);
};

const __STATIC = (url) => {
    return (url) ? path.join(STATIC_PATH, url) : STATIC_PATH;
};

const __VIEWS = (url) => {
    return (url) ? path.join(VIEWS_PATH, url) : VIEWS_PATH;
};

const __APP = (url) => {
    return (url) ? path.join(APP_PATH, url) : APP_PATH;
};

const __SERVER = (url) => {
    return (url) ? path.join(SERVER_PATH, url) : SERVER_PATH;
};

const __STORAGE = (url) => {
    return (url) ? path.join(SERVER_PATH, url) : SERVER_PATH + '/storage';
};

const __UPLOAD = (url) => {
    return (url) ? path.join(SERVER_PATH, url) : SERVER_PATH + '/storage/upload';
};

const mimeTypes = () => {
    return MIME_TYPES;
}

const __MIME = mimeTypes();

const throwErr = err => {
    throw Error(err);
};

const errorLog = err => {
    console.error(err);
};

const error = err => {
    console.error(err);
};

const __ERROR = errorLog;
const __error = errorLog;
const bytesToMb = bytes => Math.round(bytes / 1000, 2) / 1000;

const statPath = (path => {
    try {
        return fs.statSync(path);
    } catch (ex) {}
    return false;
});

const sliceLastSymbol = ((mod, url) => {
    let urlMod = url;
    if (mod === url) return url;
    if (mod === '/') {
        const lastSymbol = url.charAt(url.length - 1);
        if (lastSymbol === '/') {
            urlMod = url.slice (0, - 1);
        }
    }
    return urlMod;
});

const removeLastSlash = ((mod, url) => {
    let urlMod = url;
    if (mod === url) return url;
    if (mod === '/') {
        const lastSymbol = url.charAt(url.length - 1);
        if (lastSymbol === '/') {
            urlMod = url.slice (0, - 1);
        }
    }
    return urlMod;
});

const memory = (() => {
    // console.clear();
    const memory = [];
    const usage = process.memoryUsage();
    const row = {
        rss: bytesToMb(usage.rss), // process resident set size
        heapTotal: bytesToMb(usage.heapTotal), // v8 heap allocated
        heapUsed: bytesToMb(usage.heapUsed), // v8 heap used
        external: bytesToMb(usage.external), // c++ allocated
        stack: bytesToMb(usage.rss - usage.heapTotal), // stack
    };
    memory.push(row);
    return memory;
});

const notify = ((error, sub = 'Ошибка сервиса', text = 'Error:') => {
    mail.send(text, sub);
    __ERROR(error)
});

const replace = ((oldS, newS, fullS) => {
    for (var i = 0; i < fullS.length; ++i) {
        if (fullS.substring(i, i + oldS.length) == oldS) {
            fullS = fullS.substring(0, i) + newS + fullS.substring(i + oldS.length, fullS.length);
        }
    }
    return fullS;
});

const reject = err => {
    return new Promise(reject => {
        console.error(err);
        reject(err);
    });
};
const _promise = (data, error = null) => {
    return new Promise((resolve) => {
        resolve(data);
    }).catch(err => {
        if (error) {
            console.error(error)
            return error
        } else {
            console.error(err)
            return err
        }
    });
};

const promise = _promise;

const generateToken = (length = null) => {
    const base = (length) ? length : ALPHA_DIGIT.length;
    let key = '';
    for (let i = 0; i < TOKEN_LENGTH; i++) {
        const index = Math.floor(Math.random() * base);
        key += ALPHA_DIGIT[index];
    }
    return key;
};

const token = generateToken;

const hash = () => {
    // log({ 'process.env.SECRET_KEY': process.env.SECRET_KEY })
    const phrase = generateToken();
    const hash = crypto.createHmac('sha256', process.env.SECRET_KEY)
        .update(phrase)
        .digest('hex');
    return hash;
};

const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
        return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
};

const log = data => console.log(data);

const dump = dump => {
    log({ dump });
}

const start = () => {
    log('');
    log('START ---------------------------------------------');
}

const end = () => {
    log('END ---------------------------------------------');
    log('');
}

/**
 * Получить список параметром функции.
 * @param fn Функция
 */
const getFunctionParams = fn => {
    const COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\\)]*(('(?:\\'|[^'\r\n])*')|('(?:\\'|[^'\r\n])*'))|(\s*=[^,\\)]*))/gm;
    const DEFAULT_PARAMS = /=[^,]+/gm;
    const FAT_ARROW = /=>.*$/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const formattedFn = fn
        .toString()
        .replace(COMMENTS, '')
        .replace(FAT_ARROW, '')
        .replace(DEFAULT_PARAMS, '');
    const params = formattedFn
        .slice(formattedFn.indexOf('(') + 1, formattedFn.indexOf(')'))
        .match(ARGUMENT_NAMES);
    return params || [];
};

/**
 * Получить строковое представление тела функции.
 * @param fn Функция
 */
const getFunctionBody = fn => {
    const restoreIndent = body => {
        const lines = body.split('\n');
        const bodyLine = lines.find(line => line.trim() !== '');
        let indent = typeof bodyLine !== 'undefined' ? (/[ \t]*/.exec(bodyLine) || [])[0] : '';
        indent = indent || '';
        return lines.map(line => line.replace(indent, '')).join('\n');
    };
    const fnStr = fn.toString();
    const rawBody = fnStr.substring(
        fnStr.indexOf('{') + 1,
        fnStr.lastIndexOf('}')
    );
    const indentedBody = restoreIndent(rawBody);
    const trimmedBody = indentedBody.replace(/^\s+|\s+$/g, '');
    return trimmedBody;
};

class Database {
    constructor() {
    }
    async connect() {
        try {
            this.client_pg = new Client();
            this.connect = await this.client_pg.connect();
        } catch (e) {
            this.error = e.message;
        }
        return this;
    }

    async query(text, values) {
        try {
            this.res = await this.client_pg.query(text, values);
            await this.client_pg.end();
            return this.res.rows;
        } catch (e) {
            this.error = e.message;
        }
    }
}

const db = new Database();

/**
 * DTO Factory function.
 * @param props
 */
const DTOFactory = (props => {
    if (!props) {
        throw Error('Invalid props param')
    }
    const ret = {
        status: props.status ? props.status : 'success',
        stream: props.stream ? props.stream : null,
        error: props.error ? props.error : undefined,
        ...props
    };
    return ret;
});

const isNumber = (id => {
    return (typeof parseInt(id) === 'number');
});

const connect = (sql => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const client_pg = new Client();
                await client_pg.connect();
                const res = await client_pg.query(sql);
                resolve(res.rows);
                await client_pg.end();
            } catch (e) {
                reject(e.message);
            }
        })();
    });
});

const select = connect;

const parse = ((text, values) => {
    return new Promise((resolve, reject) => {
        (async () => {
            const client_pg = new Client();
            try {
                await client_pg.connect();
                const res = await client_pg.query(text, values);
                resolve(res.rows);
                await client_pg.end();
            } catch (e) {
                reject(e.message);
            }
        })();
    });
});

const sql = parse;
const query = parse;

const bufferConcat = (body => {
    const bufConcat = Buffer.concat(body).toString();
    const bufArray = bufConcat.split('&');
    let json = {};
    let arr = [];
    bufArray.map((item) => {
        arr = item.split('=');
        json[arr[0]] = arr[1];
    });
    return json;
});

const concatBuffer = (body => {
    const bufConcat = Buffer.concat(body).toString();
    const bufArray = bufConcat.split('&');
    let obj = {};
    let arr = [];
    bufArray.map((item) => {
        arr = item.split('=');
        obj[arr[0]] = arr[1];
    });
    return obj;
});

const parseXslx = (input => {

    console.log({ input })

    var book = xlsx.readFileSync(input), result = {};
    // Циклическое переключение каждой страницы листа на листе
    book.SheetNames.forEach(function(name) {
        // Получить текущий объект страницы листа
        var sheet = book.Sheets[name],
        // Получаем диапазон данных на текущей странице
        range = xlsx.utils.decode_range(sheet['!ref']),
        // Сохраняем данные диапазона данных
        row_start = range.s.r, row_end = range.e.r,
        col_start = range.s.c, col_end = range.e.c,
        rows = [], row_data, i, addr, cell;
        // Перебираем данные построчно

        console.log('START ----------------------')
        console.log({ sheet })
        console.log({ range })
        console.log('END ----------------------')

        for(;row_start<=row_end;row_start++) {
            row_data = [];
            // Считываем данные каждого столбца в текущей строке
            for(i=col_start;i<=col_end;i++) {
                addr = xlsx.utils.encode_col(i) + xlsx.utils.encode_row(row_start);

                console.log({ addr })

                cell = sheet[addr];

                console.log({ 'cell': cell })

                if (typeof cell === 'object') {
                    // Если это ссылка, сохраните ее как объект и сохраните исходное значение непосредственно в других форматах
                    // if(cell.l) {
                    //     console.log(cell.v)
                    //     row_data.push({text: cell.v});
                    // } else {
                    //     row_data.push(cell.v);
                    // }

                    // console.log(typeof cell)
                    // // console.log({ 'cell.v': cell.v })
                    // console.log(cell.v)
                    // console.log('--------------------------------------------------')

                    row_data.push(cell.v);

                    // console.log({ 'cell': cell[1] })

                    // console.log(row_data)
                }

                // console.log({ row_data })

                // Если это ссылка, сохраните ее как объект и сохраните исходное значение непосредственно в других форматах
                // if(cell.l) {
                //     console.log(cell.v)
                //     row_data.push({text: cell.v});
                // } else {
                //     row_data.push(cell.v);
                // }

                // row_data.push(cell.v);
            }
            // console.log(row_data)
            rows.push(row_data);

            // console.log({ rows })
            //
            // console.log('--------------------------------------------------')
        }
        // console.log({ rows })

        // console.log(rows.length)

        rows.forEach(item => {
            console.log(item)
        });

        // for (item in rows) {
        //     console.log({ item })
        // }

        // console.log('--------------------------------------------------')
        // Сохраняем данные на текущей странице
        result[name] = rows;
    });

    // console.log({ 'result': result })

    return result;
});

// const IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i

module.exports = {
    capitalizeFirstLetter,
    DTOFactory,
    log,
    start,
    dump,
    end,
    getFunctionParams,
    getFunctionBody,
    generateToken,
    token,
    hash,
    isNumber,
    connect,
    parse,
    select,
    sql,
    query,
    bufferConcat,
    concatBuffer,
    promise,
    reject,
    __ERROR,
    error,
    throwErr,
    errorLog,
    replace,
    notify,
    memory,
    sliceLastSymbol,
    removeLastSlash,
    db,
    statPath,
    isAllowed,
    httpMethods,
    __STATIC,
    __VIEWS,
    __APP,
    __SERVER,
    __STORAGE,
    __UPLOAD,
    __MIME,
    parseXslx
};
