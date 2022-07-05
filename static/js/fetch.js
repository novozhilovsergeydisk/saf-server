async function postData(url = '', data = {}, mimeType = 'application/x-www-form-urlencoded; charset=UTF-8') {
    const getValue = (id => {
        return document.getElementById(id).value;
    })
    const dataPreparation = ((ids, mimeType = 'application/json')  => {
        // console.log({ ids })
        if (mimeType === 'application/json' ) {
            let data = {};
            ids.forEach(item => {
                data[item] = getValue(item)
            })
            // console.log({ data })
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
    })
    // Default options are marked with *
    const response = await fetch(url, {
        method:      'POST', // *GET, POST, PUT, DELETE, etc.
        mode:        'cors', // no-cors, *cors, same-origin
        cache:       'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': mimeType // application/json | application/x-www-form-urlencoded; charset=UTF-8
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: dataPreparation(data, mimeType)
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
    // return await response;
}

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
