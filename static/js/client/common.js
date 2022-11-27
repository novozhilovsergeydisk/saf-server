const fio = document.getElementById('form-client-fio');
const phone = document.getElementById('form-client-phone');
const email = document.getElementById('form-client-email');
const errorEl = document.getElementById('form-client-error');
const successEl = document.getElementById('form-client-success');
const contentWrapperClient = document.getElementById('content-wrapper-client');

const btnAddClient = document.getElementById('form-client-btn-add');
const btnCancel = document.getElementById('form-client-btn-cancel');

// const addClient = document.getElementById('add-client');
//
// addClient.addEventListener('click', (e) => {
//     e.preventDefault();
//
//     contentWrapperClient.classList.toggle('hide');
//     contentWrapperClient.classList.toggle('none');
//
//     // contentWrapperClient.classList.remove('block');
// });

btnAddClient.addEventListener('click', (e) => {
    e.preventDefault();

    const url = '/admin/client/add';
    const data = {fio: fio.value, phone: phone.value, email: email.value};
    const result = fetchAsync(url, data);

    result.then(data => {
        const response = data.response;
        errorEl.innerHTML = '';
        successEl.innerHTML = '';

        if (response.status === 'failed') {
            errorEl.innerHTML = response.error.message;
        } else {
            clearForm();
            console.log('Данные успешно внесены.')
            successEl.innerHTML = response.data.message;
        }
    }).catch(err => {
        errorEl.innerHTML = '<b>Ошибка сервера.</b>';
        console.log({ err })
    });
});

btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    clearForm();
});

function clearForm() {
    fio.value = '';
    email.value = '';
    phone.value = '';
    errorEl.innerHTML = '';
    successEl.innerHTML = '';
}

