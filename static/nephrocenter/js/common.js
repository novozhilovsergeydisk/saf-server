const btnBurger = document.getElementById('btn-burger');

btnBurger.addEventListener('click', event => {
    const headerLogoMenu = document.querySelector('#header-logo__menu');
    headerLogoMenu.setAttribute('style', 'display: flex');

    const btnClose = document.getElementById('btn-close');

    btnClose.addEventListener('click', e => {
        headerLogoMenu.setAttribute('style', 'display: none');
    });

    console.log({ headerLogoMenu });
})


