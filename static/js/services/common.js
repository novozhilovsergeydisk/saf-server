const formServicesName = document.getElementById('form-services-name');
const formServicesPriceFrom = document.getElementById('form-services-price-from');
const formServicesPriceTo = document.getElementById('form-services-price-to');
const errorEl = document.getElementById('form-services-error');
const successEl = document.getElementById('form-services-success');

const formServicesBtnAdd = document.getElementById('form-services-btn-add');
const formServicesBtnCancel = document.getElementById('form-services-btn-cancel');

formServicesBtnAdd.addEventListener('click', (e) => {
    e.preventDefault();

    const url = '/admin/service/add';
    const data = {formServicesName: formServicesName.value, formServicesPriceFrom: formServicesPriceFrom.value, formServicesPriceTo: formServicesPriceTo.value};
    const result = fetchAsync(url, data);

    result.then(__data__ => {
        const response = __data__.response;
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

formServicesBtnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    clearForm();
});

function clearForm() {
    formServicesName.value = '';
    formServicesPriceFrom.value = '';
    formServicesPriceTo.value = '';
    errorEl.innerHTML = '';
    successEl.innerHTML = '';
}
