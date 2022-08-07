const getValue = (id => {
    try {
        return document.getElementById(id).value;
    } catch(err) {
        console.log({ err });
        return null;
    }
    return document.getElementById(id).value;
});

const dataPreparation = ((ids, mimeType = 'application/json')  => {
    console.log({ ids })
    if (mimeType === 'application/json' ) {
        let data = {};
        ids.forEach(item => {
            data[item] = getValue(item)
        });
        console.log({ data });
        return data;
    }
    if (mimeType === 'application/x-www-form-urlencoded; charset=UTF-8' ) {
        let data = '';
        ids.forEach(item => {
            data += '&' + item + '=' + getValue(item);
        })
        // console.log({ data })
        return data.slice(1);
    }
    return data;
});

async function fetchAsync(url = '', data = [], params = {method: null, mode: null, cache: null, credentials: null, mimeType: null, redirect: null, isPreparation: false}) {

    // if (url === '') {
    //     const error = 'Пустой url';
    //     console.log({ error });
    //     return {error: error};
    // }
    // const isArray = Array.isArray(data);
    // if (!isArray) {
    //     const error = 'Неверные данные';
    //     console.log({ error });
    //     return {error: error};
    // }
    // if (data.length === 0) {
    //     const error = 'Пустой массив с данными';
    //     console.log({ error });
    //     return {error: error};
    // }

    const { method, mode, cache, credentials, mimeType, isPreparation } = params;
    const mime = mimeType || 'application/json'; // 'application/x-www-form-urlencoded; charset=UTF-8';

    if (isPreparation) {
        params = {
            method: method || 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: mode || 'cors', // no-cors, *cors, same-origin
            cache: cache || 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: credentials || 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': mime, // application/json | application/x-www-form-urlencoded; charset=UTF-8},
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer',
                body: dataPreparation(data, mime)
            }
        };
        const response = await fetch(url, params);
        return await response.json();
    } else {
        // console.log({ url });
        // console.log({ mime });
        // console.log({ 'JSON.stringify(data)': JSON.stringify(data) });

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Content-Type': mime},
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });

        return await response.json();

    }

    // const response = await fetch(url, params);
    //     // method:      method | 'POST', // *GET, POST, PUT, DELETE, etc.
    //     // mode:        mode | 'cors', // no-cors, *cors, same-origin
    //     // cache:       cache | 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     // credentials: credentials | 'same-origin', // include, *same-origin, omit
    //     // headers: {'Content-Type': mimeType | 'application/x-www-form-urlencoded; charset=UTF-8' /* application/json | application/x-www-form-urlencoded; charset=UTF-8*/ },
    //     // redirect: 'follow', // manual, *follow, error
    //     // referrerPolicy: 'no-referrer', // no-referrer, *client
    //     // body: dataPreparation(data, mimeType)
    //     // // body: JSON.stringify(data) // body data type must match "Content-Type" header
    // // });
    // return await response.json(); // parses JSON response into native JavaScript objects

}

// console.log('fetch.js');
//
// fetchAsync('client/add', {}, {mode: 'strict'});
// fetchAsync('client/add', [], {mode: 'strict'});
// fetchAsync('client/add', ['foo', 'bar'], {noPreparation: false});

// const result = fetchAsync('/admin/client/add', {foo: 'bar'});
//
// result.then(data => console.log({ data })).catch(err => console.log({ err }));

// console.log({ result });

// fetchAsync('client/add', ['foo', 'bar'], {mode: 'strict', mimeType: 'application/json'});

// Example
// const saveBtn = document.getElementById('saveBtn');
// const textInfo = document.getElementById('text-info');
// const textError = document.getElementById('text-error');
//
// saveBtn.addEventListener('click', function(e) {
//     const idsArray = [ 'name', 'tel', 'email', 'token' ];
//     const url = '/admin/store';
//     postData(url, idsArray)
//         .then((serverData) => {
//             const status = serverData.status;
//             const info = serverData.info;
//             const error = serverData.error;
//             if (status === 'success') {
//                 textError.innerText = '';
//                 textInfo.innerText = info;
//             } else {
//                 textInfo.innerText = '';
//                 textError.innerText = error;
//             }
//
//             console.log({ serverData });
//         })
//         .catch(err => log({ err }))
// })
