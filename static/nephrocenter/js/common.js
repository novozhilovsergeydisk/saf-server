const btnBurger = document.getElementById('btn-burger');

const __get__ = (selector => {
    return document.getElementById(selector);
})

btnBurger.addEventListener('click', event => {
    const headerLogoMenu = __get__('#header-logo__menu');
    headerLogoMenu.setAttribute('style', 'display: flex');

    const btnClose = __get__('#btn-close');

    btnClose.addEventListener('click', e => {
        headerLogoMenu.setAttribute('style', 'display: none');
    });

    // console.log({ headerLogoMenu });
})


