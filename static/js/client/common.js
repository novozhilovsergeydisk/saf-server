const fio = document.getElementById('form-client-fio');
const phone = document.getElementById('form-client-phone');
const email = document.getElementById('form-client-email');
const btnAdd = document.getElementById('form-client-btn-add');
btnAdd.addEventListener('click', (e) => {


    console.log({ fio });
    console.log({ phone });
    console.log({ email });
    console.log('click');

    const url = '/admin/client/add';
    const data = {fio: fio.value, phone: phone.value, email: email.value};
    const result = fetchAsync(url, data);

    result.then(data => console.log({ data })).catch(err => console.log({ err }));
})

