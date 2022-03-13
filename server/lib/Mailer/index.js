'use strict'

const nodemailer = require('nodemailer');
const conf = require('../../conf.js');

const transporter = nodemailer.createTransport({
    host: conf.mailer.host,
    port: conf.mailer.port,
    secure: conf.mailer.secure,
    auth: {
        user: conf.mailer.auth.user,
        pass: conf.mailer.auth.pass
    }
});

class MailService {
    async send(text, sub) {
        const { host, port, secure  } = conf.mailer;
        const { user, pass  } = conf.mailer.auth;
        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: user, // generated ethereal user
                pass: pass, // generated ethereal password
            },
        });

        const info = await transporter.sendMail({
            from: `<${user}>`, // sender address
            to: user, // list of receivers
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

class MailerAdmin{
    async send(text, sub) {
        const { host, port, secure  } = conf.mailer;
        const { admin_user, admin_pass  } = conf.mailer.auth;
        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure, // true for 465, false for other ports
            auth: {
                user: admin_user, // generated ethereal user
                pass: admin_pass, // generated ethereal password
            },
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

