document.addEventListener('click', e => {
    setVideo(e);
});

function setVideo(e) {
    let parent = null;

    const className = e.target.className;

    if (className === 'video-text') parent = e.target.offsetParent.offsetParent;

    if (className === 'video-link') parent = e.target.offsetParent;

    if (parent !== null) {
        const id = parent.dataset.id;
        const src = parent.dataset.src;
        const content = `<iframe width="720" height="405" src="${src}${id}" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>`
        parent.innerHTML = content;

        return true;
    }

    return false;
}

function hide(e) {
    // Поддержка IE 6-8
    var target = e.target || e.srcElement;
    target.style.visibility = 'hidden';
}
