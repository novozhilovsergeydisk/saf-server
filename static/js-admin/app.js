const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                '/js-admin/sw.js',
                {
                    scope: '/js-admin/',
                }
            );

            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }

            self.addEventListener('activate', event => {
                console.log('v1 now ready to handle fetches');
            })
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

// ...

registerServiceWorker();

console.log('app.js - здесь код воркера');


