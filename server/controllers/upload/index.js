const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const xlsx = require('xlsx');
const {log, __SERVER, __UPLOAD} = require('../../helpers.js');
// const nunjucks = require('nunjucks');

log(__SERVER())

const dto = require(__SERVER() + '/lib/DTO/index.js');
const { tmpl } = require(__SERVER() + '/lib/Renderer/index.js');

// nunjucks.configure(__VIEWS(), { autoescape: true });

// const cached = new Map();
// const cachedHTML = new Map();

// Handlers
class UploadControllers {
    async index() {
        const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        return dto.stream(render);
    }

    async uploadClients(client) {
        // log({ client })

        try {
            const file = './server/storage/upload/clients.xls';
            log('uploadClients')
            const book = xlsx.readFileSync(file);
            let result = {};

            // console.log({ book })

            // Циклическое переключение каждой страницы листа на листе

            book.SheetNames.forEach(function(name){
                // Получить текущий объект страницы листа
                var sheet = book.Sheets[name],
                    // Получаем диапазон данных на текущей странице
                    range = xlsx.utils.decode_range(sheet['!ref']),
                    // Сохраняем данные диапазона данных
                    row_start = range.s.r, row_end = range.e.r,
                    col_start = range.s.c, col_end = range.e.c,
                    rows = [], row_data, i, addr, cell;
                // Перебираем данные построчно

                // console.log('START ----------------------')
                // console.log({ sheet })
                // console.log({ range })
                // console.log('END ----------------------')

                for(;row_start<=row_end;row_start++) {
                    row_data = [];
                    // Считываем данные каждого столбца в текущей строке
                    for(i=col_start;i<=col_end;i++) {
                        addr = xlsx.utils.encode_col(i) + xlsx.utils.encode_row(row_start);

                        // console.log({ addr })

                        cell = sheet[addr];

                        // console.log({ 'cell': cell })

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
                    // if (item.length === 8) {
                    //     // console.log(item[7])
                    // }
                    //
                    // if (item.length === 9) {
                    //     console.log(item[0])
                    //     console.log(item[1])
                    //     console.log(item[4])
                    //     console.log('')
                    //     console.log(item[8])
                    //     console.log('------------------------------')
                    // }

                    console.log(item.length)
                    console.log(item)
                });

                // for (item in rows) {
                //     console.log({ item })
                // }

                console.log('--------------------------------------------------')
                // Сохраняем данные на текущей странице
                result[name] = rows;
            });

            // console.log({ 'result': result })

            client.res.end('uploadClients');
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
            // return {foo:'bar'}
        }

        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);

    }

    async upload(client) {
        // log({ client })

        try {
            const bb = busboy({ headers: client.req.headers });
            bb.on('file', (name, file, info) => {
                // console.log({ info })
                const filename = info.filename;
                console.log({ filename })
                client.res.setHeader('File-Upload', filename);
                try {
                    const saveTo = path.join(__UPLOAD(), filename);
                    // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                    // console.log({ file })
                    // file.pipe(process.stdout)
                    console.log({ saveTo })
                    // console.log(os.tmpdir())
                    file.pipe(fs.createWriteStream(saveTo));
                } catch(err) {
                    console.log({ err })
                }
            });

            bb.on('field', (name, val, info) => {
                // console.log({ info })
                console.log(`Field [${name}]: value: %j`, val);
                // params.set(name, val);
                client.res.setHeader(`Field-${name}`, `${val}`);
            });

            bb.on('close', () => {
                client.res.setHeader('Info-Status', true);
                client.res.writeHead(200, { 'Connection': 'close' });
                client.res.end(`Файл успешно загружен на сервер` );
                // return `That's all folks!!!`;
                // res.writeHead(200, { 'Connection': 'close' });
                // res.end(`That's all folks!!!`);
            });
            client.req.pipe(bb);
            return;
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
            // return {foo:'bar'}
        }

        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);

    }
}

const uploadController = new UploadControllers();

module.exports = { uploadController };
