const btnBurger = document.getElementById('btn-burger');

btnBurger.addEventListener('click', event => {
    const headerLogoMenu = document.querySelector('#header-logo__menu');
    headerLogoMenu.setAttribute('style', 'display: flex');

    const btnClose = document.getElementById('btn-close');

    btnClose.addEventListener('click', e => {
        headerLogoMenu.setAttribute('style', 'display: none');
    });

    headerLogoMenu.addEventListener('click', e => {
        // console.log(`Кнопка: ${e.which}`);
        // console.log(`Координаты: (${e.x};${e.y})`);
        // console.log(`Тип события: ${e.type}`);
        // console.log(`Тег элемента: ${e.currentTarget.tagName}`);

        // console.log(e.target);
        // console.log({ event: typeof e.target });

        // if (e.target === 'a') {
        //     console.log({ event: e.target });
        // }

        // headerLogoMenu.setAttribute('style', 'display: none');

        // headerLogoMenu.classList.remove('show');
        // headerLogoMenu.classList.add('hide');
    });

    // headerLogoMenu.classList.remove('hide');
    // headerLogoMenu.classList.add('show');

    console.log({ headerLogoMenu });
})


