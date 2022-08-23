const btnBurger = document.getElementById('btn-burger');
const btnHamburger = document.getElementById('btn-hamburger');
const btnClose = document.getElementById('btn-close');
const headerLogoMenu = document.querySelector('#header-logo__menu');

btnClose.addEventListener('click', e => {
    headerLogoMenu.setAttribute('style', 'display: none');
});

btnBurger.addEventListener('click', event => {
    // const headerLogoMenu = document.querySelector('#header-logo__menu');
    headerLogoMenu.setAttribute('style', 'display: flex');

    console.log({ headerLogoMenu });
});

btnHamburger.addEventListener('click', event => {
    // const headerLogoMenu = document.querySelector('#header-logo__menu');
    console.log(btnHamburger.dataset.status);

    if (btnHamburger.dataset.status === 'not-active') {
        headerLogoMenu.setAttribute('style', 'display: flex');
        btnHamburger.setAttribute('style', 'transform: translateY(12px) rotate(135deg)');
        btnHamburger.dataset.status = 'active';
    } else {
        headerLogoMenu.setAttribute('style', 'display: none');
        btnHamburger.setAttribute('style', 'transform: translateY(-12px) rotate(-135deg)');
        btnHamburger.dataset.status = 'not-active';
    }
});

