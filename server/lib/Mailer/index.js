'use strict';

const nodemailer = require('nodemailer');

const host = process.env.MAILER_HOST;
const port = process.env.MAILER_PORT;
const secure = process.env.MAILER_SECURE;
const user = process.env.MAILER_AUTH_USER;
const user_pass = process.env.MAILER_AUTH_PASS;
const admin_user = process.env.MAILER_AUTH_ADMIN_USER;
const admin_pass = process.env.MAILER_AUTH_ADMIN_PASS;

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
        user: user,
        pass: user_pass
    }
});

class MailService {
    async send(text, sub) {
        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: user,
                pass: user_pass
            }
        });

        const info = await transporter.sendMail({
            from: `<${user}>`, // sender address
            to: user, // list of receivers
            subject: sub,
            text: text,
            html: text
        });

        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    async sendMessage(text, sub) {
        this.send(JSON.stringify(text), sub);
    }
}

class MailerAdmin{
    async send(text, sub) {
        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: admin_user,
                pass: admin_pass
            }
        });

        const info = await transporter.sendMail({
            from: `Admin <${admin_user}>`, // sender address
            to: admin_user, // list of receivers
            subject: sub, // +  ' ✔', // Subject line
            text: text, // plain text body
            html: text, // html body
        });

        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // main().catch(console.error);
    }

    async sendMessage(text, sub) {
        this.send(JSON.stringify(text), sub);
    }
}

const mail = new MailService();

const mailAdmin = new MailerAdmin();

// module.exports = mailAdmin;

module.exports = { transporter, nodemailer, mailAdmin, mail, MailService }

