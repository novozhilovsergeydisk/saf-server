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

        const response = await fetch(url,{
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

async function __fetchAsync__(url = '', data = [], mimeType = 'application/x-www-form-urlencoded') {
    let body = null;

    if (mimeType === 'application/x-www-form-urlencoded') {
        body = data;
    }

    if (mimeType === 'application/json') {
        body = JSON.stringify(data);
    }

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': mimeType
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: body
    });

    return await response;
}

function resolve(response, cb) {
    response.then((response) => response.body)
        .then((rb) => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                // console.log('done', done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            // console.log(done, value);
                            push();
                        });
                    }

                    push();
                },
            });
        })
        .then((stream) =>
            // Respond with our stream
            new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text()
        )
        .then((result) => {
            cb(result)
        });
}
