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
const navigation = document.getElementById('banner-navigation');

const metaData = [
    {
        bannerName: `Главная страница`,
        bannerNumber: 1,
        bannerImage: `kidney.png`,
        bannerLink: `/`,
        bannerTitle: `ТелеНефроЦентр - Это`,
        bannerText: `<p>
                — возможность получения «второго мнения» в службе нефрологической помощи московской ГКБ №52
                <br>— дистанционная связь  с лечащим нефрологом ранее выявление и коррекция осложнений
                <br>— удаленная поддержка в адаптации к лечению и диализу
                <br>— патронаж пациентов на перитонеальном диализе
                <br>— мониторинг реципиентов до и после трансплантации
                <br>— образовательные школы по питанию и образу жизни
                <br>— онлайн группы пациентской взаимопомощи
                
            </p>`,
        params: { bannerImage: { visible: false } }
    },
    {
        bannerName: `Профилактика`,
        bannerNumber: 2,
        bannerImage: `profilactika.png`,
        bannerLink: `/info/pat/1`,
        bannerTitle: `Профилактика <br>болезни почек`,
        bannerText: `<p>
                Почка является парным органом, который играет роль «фильтра», способствующего очищению крови от различных продуктов обмена веществ («отходов» организма), они вырабатывают мочу, которая затем поступает в мочевой пузырь, где накапливается между мочеиспусканиями, даже если одна почка полностью перестанет функционировать, вторая сможет в полном объеме очищать организм от шлаков и выполнять все другие необходимые функции.
            
            </p>`,
        params: { bannerImage: { visible: true } }
    },
    {
        bannerName: `Заболевания`,
        bannerNumber: 3,
        bannerImage: `zabolevanie.png`,
        bannerLink: `/info/pat/22`,
        bannerTitle: `Все, что нужно знать о заболеваниях почек`,
        bannerText: `<p>
            Врачи называют болезнь  почек  «тихим убийцей» . Признаки поражения почек отмечаются у каждого десятого взрослого жителя Земли. Но многие, страдающие хронической болезнью почек, длительное время даже не подозревают, что они больны. Коварство заболеваний почек заключается в том, что они могут многие годы не давать знать о себе, не вызывать никаких жалоб, так что обнаружить их можно только пройдя медицинское обследование, сдав анализы мочи и крови.
             
            </p>`,
        params: { bannerImage: { visible: true } }
    },
    {
        bannerName: `Диализ`,
        bannerNumber: 4,
        bannerImage: `dialis.png`,
        bannerLink: `/info/pat/33`,
        bannerTitle: `Диализ`,
        bannerText: `<p>
                Когда заболевания почек достигает 5-й Стадии (СКФ 15%)Ваши почки больше не выполняют свою функцию эффективно, что приводит к накоплению жидкости и токсинов в крови. 
         
            </p>
            <p>
                Диализ поможет вывести избытки жидкости и токсины из Вашего организма, так как поврежденные почки не в состоянии это сделать.
                
            </p>    
            <p>
                Существуют два типа диализа: гемодиализ и перитониальный диализ.
                
            </p>`,
        params: { bannerImage: { visible: true } }
    },
    {
        bannerName: `Трансплантация`,
        bannerNumber: 5,
        bannerImage: `transplant.png`,
        bannerLink: `/info/pat/44`,
        bannerTitle: `Трансплантация: как попасть в «лист ожидания»?`,
        bannerText: `<p>
            Трансплантация показана при наличии терминальной почечной недостаточности. Если у пациента имеется единственная почка, после подтверждения целесообразности трансплантации почки, и отсутствия у Вас родственников, которые смогли бы стать донорами почки, Вас зарегистрируют в листе ожидания трансплантации почки, чтобы пересадить Вам почку от умершего донора.
            
        </p>`,
        params: { bannerImage: { visible: true } }
    },
    {
        bannerName: `Диета и ЛФК`,
        bannerNumber: 6,
        bannerImage: `dieta.png`,
        bannerLink: `/info/pat/55`,
        bannerTitle: `Особенности питания и <br>физической активности пациентов с ХБП`,
        bannerText: `<p>
        Питательный (нутриционный) статус – один из основных факторов, определяющих качество и продолжительность жизни, а также эффективность проводимого лечения. Когда почки уже не работают в полную силу, ваше здоровье и благополучие зависят от правильного питания, которое может компенсировать изменения, которые произошли в организме.
            
        </p>`,
        params: { bannerImage: { visible: true } }
    }
]

let bannerRotateEnable = true;

const removeClass = ((className, elementsArray) => {
    elementsArray.forEach(function(entry) {
        entry.classList.remove(className);
        // console.log(entry);
    });
});

const transform = (() => {

});

const createBanner = ((data, e) => {
    const params = data.params;
    bannerImage.style.opacity = "0.0";
    removeClass('active-circle', [btnBanner1, btnBanner2, btnBanner3, btnBanner4, btnBanner5, btnBanner6]);
    if (e) {
        e.target.classList.add('active-circle');
    } else {
        if (data && data.bannerNumber) {
            const id = 'btn-banner-' + data.bannerNumber.toString();
            console.log({ id });
            const btnCircle = document.getElementById(id);
            btnCircle.classList.add('active-circle');
            console.log({ btnCircle });
        }
    }
    setTimeout(() => {
        init();
        // console.log({ params });
        bannerImage.style.opacity = "1.0";
        if (window.innerWidth < 1600) {
            bannerImage.setAttribute('style', 'background-image: "none"');
        } else {
            bannerImage.setAttribute('style', 'background-image: url("/images/banner/' + data.bannerImage + '"');

            if (data.bannerName === 'Диализ') {
                bannerImage.classList.add('background-position-right-20');
            }
        }
        if (params && !params.bannerImage.visible) {
            bannerDetail.classList.add('hidden');
        }
        bannerTitle.innerHTML = data.bannerTitle;
        bannerText.innerHTML = data.bannerText;
        bannerLink.href = data.bannerLink;
        //
    }, "500");
});

const rotateBanner = (() => {
    let i = 1;
    setInterval(() => {
        // console.log({ i });
        // console.log({ bannerRotateEnable });
        if (bannerRotateEnable) {
            createBanner(metaData[i]);
        }
        i++;

        if (i === 6) i = 0;
    }, "9000");
});

rotateBanner();

function init() {
    bannerDetail.classList.remove('hidden');
    bannerImage.classList.remove('background-position-right-20');
    bannerImage.classList.remove('background-position-right-150');
}

bannerDetail.classList.add('hidden');
bannerImage.classList.add('height-750');

// Главная
btnBanner1.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[0], e, { bannerImage: { visible: false } });
});

// Профилактика
btnBanner2.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[1], e);
});

// Заболевания
btnBanner3.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[2], e);
});

// Диализ
btnBanner4.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[3], e);
});

// Трансплантация
btnBanner5.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[4], e);
});

// Диета и ЛФК
btnBanner6.addEventListener('click', e => {
    bannerRotateEnable = false;
    createBanner(metaData[5], e);
});
