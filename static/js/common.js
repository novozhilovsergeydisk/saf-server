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

    // 1

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

    // 2

    const formClientBtnSave = document.getElementById('form-client-btn-save')

    formClientBtnSave.addEventListener('click', (e) => {
        log({ formClientBtnSave })

        // const formData = new FormData();
        // const fio = document.getElementById('fio');
        // const email = document.getElementById('email');
        // const phone = document.getElementById('phone');
        // const date = document.getElementById('date');
        // const time = document.getElementById('time');
        //
        // console.log(fio.value)
        //
        // formData.append('fio', fio.value);
        // formData.append('email', email.value);
        // formData.append('phone', phone.value);
        // formData.append('date', date.value);
        // formData.append('time', time.value);

        const fio = document.getElementById('form-client-fio').value
        const email = document.getElementById('form-client-email').value
        const phone = document.getElementById('form-client-phone').value

        const data = {
            fio: fio,
            email: email,
            phone: phone
        }

        console.log({ data })

        const result = fetch('/crm/form/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        result
        .then(result => {
            // console.log(Object.keys(result))
            console.log('Success:', result.status)
        })
        .catch(error => {
            console.error('Error:', error)
        })

        // const res = fetch('/form/data', {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-type': 'application/x-www-form-urlencoded'
        //     },
        //     body: formdata
        // })
        // const data = res.json()
        // log({ data })
        // if (res.status !== 200) {
        //     throw new Error(res);
        // }
        // return res
        // log({ e })
        // log('click btnSave')
    })

    // 3

    // const formClientBtnSave = document.getElementById('form-client-btn-save')
    //
    // btnSave.addEventListener('click', (e) => {
    //     log({formClientBtnSave})
    //
    // })

    // const toggleType =(el => {
    //     if (el.getAttribute('type') === 'password') {
    //         el.setAttribute('type', 'text');
    //         // log(el.getAttribute('type'))
    //     } else if (el.getAttribute('type') === 'text') {
    //         el.setAttribute('type', 'password');
    //         // log(el.getAttribute('type'))
    //     }
    // })
    // document.addEventListener('click', (event) => {
    //     // event.preventDefault();
    //     if (event.target.dataset['click']) toggleType(document.getElementById('pass'));
    //     if (event.target.dataset['upload']) {
    //         // event.stopPropagation()
    //         log('upload')
    //     };
    //
    //     // if (event.target.dataset['click_glyphicon']) {
    //     //     const parentEl = event.target.parentElement;
    //     //
    //     //     if (parentEl) {
    //     //         parentEl.innerHTML = parentEl.getAttribute('data-name');
    //     //         const hashVideo = parentEl.getAttribute('data-video');
    //     //         removeClassList(buttons, 'btn-video-active');
    //     //         parentEl.classList.add('btn-video-active');
    //     //         removeVideoContent();
    //     //         showVideo(hashVideo, parentEl);
    //     //     }
    //     // }
    // });
})

document.addEventListener("DOMContentLoaded", ready);

