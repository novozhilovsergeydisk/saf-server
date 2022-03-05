'use strict';

module.exports = {
    secret: 'secret_key',
    db: {
        user: 'postgres',
        host: '127.0.0.1',
        name: 'db_name',
        password: 'password',
        port: 5432
    },
    jwt_access_token: 'generate_token',
    jwt_refresh_token: 'generate_token',
    mailer: {
        host: 'smtp.server_name.domain_name',
        port: 465,
        secure: true,
        auth: {
            user: 'user@domain_name',
            pass: 'password',
            admin_user: 'admin@domain_name',
            admin_pass: 'password'
        },
        options: {
            from: 'from@domain_name',
            to: 'to@domain_name',
            subject: 'Subject description'
        }
    },
    views_name: '/html'
}