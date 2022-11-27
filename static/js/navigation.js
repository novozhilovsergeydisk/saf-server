const clients = document.getElementById('clients');
clients.addEventListener('click', (e) => {
    console.log('clients');
    location.href = '/admin/clients';
});

const services = document.getElementById('services');
services.addEventListener('click', (e) => {
    console.log('services');
    location.href = '/admin/services';
});

const records = document.getElementById('records');
records.addEventListener('click', (e) => {
    console.log('records');
    location.href = '/admin/records';
});
