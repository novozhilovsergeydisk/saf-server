// Фунции общего применения

// function cache(key, value)
// {
//     if (typeof value == 'undefined') {
//         return cache[key];
//     }
//     cache[key] = value;
// }
//
// // _io_q - обертка под querySelector, сохраняющая данные в кэш
// const _io_q = function(selector)
// {
//     if (!cache(selector)) {
//         cache(selector, document.querySelector(selector));
//     }
//     return cache(selector);
// }
//
// console.time('regular querySelector');
// for (var i = 0; i < 1000000; i++) {
//     document.querySelector('h1');
// }
// console.timeEnd('regular querySelector'); // regular querySelector: 100.6123046875ms
// console.time('cached _io_q');
// for (var i = 0; i < 1000000; i++) {
//     _io_q('h1');
// }
// console.timeEnd('cached _io_q'); // cached _io_q: 5.77392578125ms

const log = (data => {
    console.log(data)
})

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

    const btnUpload = document.getElementById('btn_uploadfile')

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

    const toggleType =(el => {
        if (el.getAttribute('type') === 'password') {
            el.setAttribute('type', 'text');
            // log(el.getAttribute('type'))
        } else if (el.getAttribute('type') === 'text') {
            el.setAttribute('type', 'password');
            // log(el.getAttribute('type'))
        }
    })
    document.addEventListener('click', (event) => {
        // event.preventDefault();
        if (event.target.dataset['click']) toggleType(document.getElementById('pass'));
        if (event.target.dataset['upload']) {
            // event.stopPropagation()
            log('upload')
        };

        // if (event.target.dataset['click_glyphicon']) {
        //     const parentEl = event.target.parentElement;
        //
        //     if (parentEl) {
        //         parentEl.innerHTML = parentEl.getAttribute('data-name');
        //         const hashVideo = parentEl.getAttribute('data-video');
        //         removeClassList(buttons, 'btn-video-active');
        //         parentEl.classList.add('btn-video-active');
        //         removeVideoContent();
        //         showVideo(hashVideo, parentEl);
        //     }
        // }
    });
})

document.addEventListener("DOMContentLoaded", ready);

