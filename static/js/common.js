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

const ready = (() => {
    log('ready');
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
        event.preventDefault();
        if (event.target.dataset['click']) toggleType(document.getElementById('pass'));

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

