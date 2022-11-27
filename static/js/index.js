const search = document.getElementById('search');
console.log({ 'search': search })

search.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
        // console.log(search.value);
    }

    const model = e.target.dataset.model;
    console.log({ model });

    e.preventDefault();

    const searchValue = (search.value).trim();

    if (searchValue !== '') {
        const url = '/admin/search';
        const data = {search: search.value, model: model};
        const result = fetchAsync(url, data);

        result.then(data => {
            console.log({ 'data: ': data })

            // const response = data.response;
            // errorEl.innerHTML = '';
            // successEl.innerHTML = '';
            //
            // if (response.status === 'failed') {
            //     errorEl.innerHTML = response.error.message;
            // } else {
            //     // clearForm();
            //     console.log('test');
            //     successEl.innerHTML = response.data.message;
            // }
        }).catch(err => {
            errorEl.innerHTML = '<b>Ошибка сервера.</b>';
            console.log({ err })
        });
    }

    console.log({ searchValue });
    // console.log(e.code);
})

