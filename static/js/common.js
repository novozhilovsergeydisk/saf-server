const log = data => console.log(data)
const dump = dump => console.log({ dump })

async function fetchRequest(route) {
    const formdata = new FormData();
    // formdata.append('image', file, 'image.png');

    const res = await fetch(route, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: formdata
    })

    const  data = await res.json()

    log({ data })

    if (res.status !== 200) {
        throw new Error(data.message);
    }

    return data;
}

async function sendFile(file) {
    const formdata = new FormData();
    formdata.append('image', file, 'image.png');

    const resp = await fetch('/upload', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'image/png',
                'Content-type': 'multipart/form-data'
            },
            body: formdata
        }),
        respData = await resp.json();

    if (resp.status !== 200) {
        throw new Error(respData.message);
    }

    return respData;
}

function upload(file) {

    log({ file })

    let xhr = new XMLHttpRequest();

    // track upload progress
    xhr.upload.onprogress = function(event) {
        console.log(`Uploaded ${event.loaded} of ${event.total}`);
    };

    // track completion: both successful or not
    xhr.onloadend = function() {
        if (xhr.status == 200) {
            console.log("success");
        } else {
            console.log("error " + this.status);
        }
    };

    xhr.open("POST", "/upload");
    xhr.send(file);
}

const ready = (() => {
    log('ready');

    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return await response.json(); // parses JSON response into native JavaScript objects
    }

    // form-upload

    const btnUpload = document.getElementById('btn_uploadfile')

    console.log({ btnUpload })

    if (btnUpload !== null) {
        btnUpload.addEventListener('click', (event) => {
            // const data = new FormData()
            // const uploadInput = document.getElementById('upload')
            //
            // log(uploadInput.files)
            //
            // data.append('file', uploadInput.files[0])
            //
            // let upload = fetch('/upload', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json;charset=utf-8'
            //     },
            //     body: JSON.stringify(uploadInput)
            // }).then(
            //     response => response.json() // if the response is a JSON object
            // ).then(
            //     success => console.log(success) // Handle the success response object
            // ).catch(
            //     error => console.log(error) // Handle the error response object
            // );

            // response.then(data => {
            //     log('xxxxxxxxxxxxxxxxxxxx')
            //     log({ data })
            // }).catch(err => {
            //     log({ err })
            // })

            log({ upload })

            // log({ btnUpload })
        })
    }

    // form-client

    const formClientBtnSave = document.getElementById('form-client-btn-save')

    formClientBtnSave.addEventListener('click', (e) => {
        log({ formClientBtnSave })

        const fio = document.getElementById('form-client-fio').value
        const email = document.getElementById('form-client-email').value
        const phone = document.getElementById('form-client-phone').value

        const data = {
            fio: fio,
            email: email,
            phone: phone
        }

        console.log({ data })

        postData('/crm/clients/insert', data)
            .then((data) => {
                console.log({ data });
            })
            .catch(err => log({ err }));;

    })

    // form-services

    const formServicesBtnSave = document.getElementById('form-services-btn-save')

    formServicesBtnSave.addEventListener('click', (e) => {
        log({ formServicesBtnSave })

        const servicesName = document.getElementById('form-services-name').value
        const servicesPriceFrom = document.getElementById('form-services-price-from').value
        const servicesPriceTo = document.getElementById('form-services-price-to').value

        const data = {
            servicesName: servicesName,
            servicesPriceFrom: servicesPriceFrom,
            servicesPriceTo: servicesPriceTo
        }

        console.log({ data })

        postData('/crm/services/insert', data)
            .then((data) => {
                console.log({ data }); // JSON data parsed by `response.json()` call
            })
            .catch(err => log({ err }));

    })
})

document.addEventListener("DOMContentLoaded", ready);

