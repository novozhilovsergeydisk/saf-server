const btnBurger = document.getElementById('btn-burger');
const btnClose = document.getElementById('btn-close');
const headerLogoMenu = document.querySelector('#header-logo__menu');
const bannerImage = document.getElementById('banner-image');
const bannerTitle = document.getElementById('banner-title');
const bannerText = document.getElementById('banner-text');
const bannerDetail = document.getElementById('banner-detail');
const bannerLink = document.querySelector('#banner-detail > a');
const btnBanner1 = document.getElementById('btn-banner-1');
const btnBanner2 = document.getElementById('btn-banner-2');
const btnBanner3 = document.getElementById('btn-banner-3');
const btnBanner4 = document.getElementById('btn-banner-4');
const btnBanner5 = document.getElementById('btn-banner-5');
const btnBanner6 = document.getElementById('btn-banner-6');

const removeClass = ((className, elementsArray) => {
    elementsArray.forEach(function(entry) {
        entry.classList.remove(className);
        console.log(entry);
    });
});

const transform = (() => {

});

bannerDetail.classList.add('hidden');

console.log({ bannerLink });

// removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);

btnBanner1.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.add('hidden');
    bannerText.innerHTML = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, ipsam.</p>'
    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/kidney.png"');
});

btnBanner2.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.remove('hidden');
    bannerLink.setAttribute('href', '/info/pat/1');
    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_2.png"');
});

btnBanner3.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.remove('hidden');
    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_3.png"');
});

btnBanner4.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.remove('hidden');

    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_4.png"');
});

btnBanner5.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.remove('hidden');
    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_5.png"');
});

btnBanner6.addEventListener('click', e => {
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    e.target.classList.add('active-circle');
    bannerDetail.classList.remove('hidden');
    bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_6.png"');
});

// bannerImage.addEventListener('click', e => {
//     bannerImage.setAttribute('style', 'background-image: url("/nephrocenter/images/banner/banner_2.png"');
// });

btnClose.addEventListener('click', e => {
    headerLogoMenu.setAttribute('style', 'display: none');
});

btnBurger.addEventListener('click', event => {
    headerLogoMenu.setAttribute('style', 'display: flex');
});

// background-image: url('/nephrocenter/images/banner/kidney.png');

