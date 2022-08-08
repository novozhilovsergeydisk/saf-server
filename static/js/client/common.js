const fio = document.getElementById('form-client-fio');
const phone = document.getElementById('form-client-phone');
const email = document.getElementById('form-client-email');
const btnAddClient = document.getElementById('form-client-btn-add');
const btnCancel = document.getElementById('form-client-btn-cancel');
const errorEl = document.getElementById('form-client-error');
const successEl = document.getElementById('form-client-success');
errorEl.innerHTML = 'ERROR!';
successEl.innerHTML = 'SUCCESS!';

btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
});

btnAddClient.addEventListener('click', (e) => {
    e.preventDefault();

    const url = '/admin/client/add';
    const data = {fio: fio.value, phone: phone.value, email: email.value};
    const result = fetchAsync(url, data);

    result.then(__data__ => {
        const response = __data__.response;
        errorEl.innerHTML = '';
        successEl.innerHTML = '';

        if (response.status === 'failed') {
            errorEl.innerHTML = response.error.message;
        } else {
            console.log('Данные успешно внесены')
            successEl.innerHTML = response.data.message;
        }

        // console.log({ status })
        // console.log(__data__)
        // console.log(__data__.response)
    }).catch(err => {
        console.log({ err })
    });
});

