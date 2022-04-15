const fs = require('fs')
const xlsx = require('xlsx');

const file = './server/storage/upload/report.xlsx';

const parse = (input => {
    var book = xlsx.readFileSync(input), result = {};

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

    return result;
})

module.exports = parse;

// parse(file);

// if(typeof require !== 'undefined') XLSX = require('xlsx');
// const workbook = XLSX.readFile('./server/storage/upload/services.xls');
// /* DO SOMETHING WITH workbook HERE */
// // Получаем все имена таблиц в Excel
//  const sheetNames = workbook.SheetNames; // return ['sheet1', 'sheet2']
// console.log({ sheetNames: sheetNames })
//  // Получаем соответствующую таблицу по имени таблицы
// const worksheet = workbook.Sheets[sheetNames[0]];
// // console.log({ worksheet })
// const object = worksheet; // { a: 1, b: 2, c: 3 };
//
// // Получить объект ячейки A1
// let a1 = worksheet ['A1']; // вернуть {v: 'hello', t: 's', ...}
// console.log(a1)
// // Получаем значение в A1
// a1.v // return'hello '
//
// console.log(a1.v)
//
// console.log('---------------------------------')
//
// // Получаем допустимый диапазон таблицы
// worksheet ['! ref'] // вернуть 'A1: B20'
// // Возвращаем объект диапазона, {s: {r: 0, c: 0}, e: {r: 100, c: 2}}
// worksheet['!range']
//
// // Получаем объединенную ячейку
// // Возвращаем список объектов диапазона, [{s: {r: 0, c: 0}, c: {r: 2, c: 1}}]
// worksheet['!merges']
//
// for (const property in object) {
//     // console.log({ 'property': property })
//     // console.log(typeof property)
//     // console.log(`${property}: ${object[property]}`);
//
//     const content = object[property];
//
//     for (const item in content) {
//         // console.log({ item })
//         // console.log('-------')
//     }
//
//     // console.log('---------------------------------')
// }


    // console.log(typeof worksheet)


//console.log(worksheet.A1)

//console.log({ worksheet })
// console.log({ 'workbook': workbook });
