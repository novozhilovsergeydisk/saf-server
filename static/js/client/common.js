const fio = document.getElementById('form-client-fio');
const phone = document.getElementById('form-client-phone');
const email = document.getElementById('form-client-email');
const btnAddClient = document.getElementById('form-client-btn-add');
const btnCancel = document.getElementById('form-client-btn-cancel');
const errorEl = document.getElementById('form-client-error');
errorEl.innerHTML = 'ERROR!'

btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
});

btnAddClient.addEventListener('click', (e) => {
    e.preventDefault();

    // console.log({ fio });
    // console.log({ phone });
    // console.log({ email });
    // console.log('click');

    const url = '/admin/client/add';
    const data = {fio: fio.value, phone: phone.value, email: email.value};
    const result = fetchAsync(url, data);

    result.then(__data__ => {
        console.log({ __data__ })
    }).catch(err => {
        console.log({ err })
    });
});

