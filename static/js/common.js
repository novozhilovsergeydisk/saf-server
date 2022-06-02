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

    const btnSave = document.getElementById('btn-save')

    btnSave.addEventListener('click', (e) => {
        log({ btnSave })

        // log({ formdata })
        //
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

