const btnAuth = document.getElementById('btn-auth');
const showPassword = document.getElementById('show-password');
const roleDiv = document.getElementById('roles_div');
const error = document.getElementById('error');

btnAuth.addEventListener('click', event => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const saveCheckbox = document.getElementById('save-checkbox').checked;

    event.preventDefault();

    const data = new URLSearchParams({email: email, pass: pass, save: saveCheckbox, role: ''});

    const response = fetchAsync('/requestUser.php', data);

    response.then((response) => response.body)
        .then((rb) => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and "value" a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            // console.log(done, value);
                            push();
                        });
                    }

                    push();
                },
            });
        })
        .then((stream) =>
            // Respond with our stream
            new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text()
        )
        .then((result) => {
            try {
                const res = JSON.parse(result);

                if (res.result === 'ok') {
                    error.innerHTML = '';

                    if (res.roles.length > 1) {
                        const roles = document.getElementById('roles');
                        roles.classList.remove('hidden');

                        roleDiv.innerHTML = res.roles_div;

                        document.addEventListener('click', event => {
                            const role = event.target.dataset.role;

                            if (role) {
                                console.log({ role });
                                const link = setUsrPath('/' + role);
                                window.location.href = link;
                            }
                        });
                    }
                }

                if (res.result === 'fail') {
                    error.innerHTML = 'РђРІС‚РѕСЂРёР·Р°С†РёСЏ РѕС‚РєР»РѕРЅРµРЅР°. <br>' + res.err + '.';
                }

                console.log(res);

            } catch (e) {
                console.log({ e });
            }
        });
});

showPassword.addEventListener('click', event => {
    const pass = document.getElementById('pass');
    const attr = pass.getAttribute('type');

    if (attr === 'password') {
        pass.setAttribute('type', 'text');
    }

    if (attr === 'text') {
        pass.setAttribute('type', 'password');
        // console.log({ showPassword });
    }
});
