const nodemailer = require('nodemailer');
const conf = require('../conf.js');

class MailService {
    constructor(obj = null) {
        this.transporter = nodemailer.createTransport({
            host: conf.mailer.host,
            port: conf.mailer.port,
            secure: conf.mailer.secure,
            auth: {
                user: conf.mailer.auth.user,
                pass: conf.mailer.auth.pass
            }
        });

        if (obj) this.options(obj);
    }

    /*from: conf.mailOptions.from,
    to: conf.mailOptions.to,
    subject: conf.mailOptions.subject*/

    async sendActivationMail(to, link) {}

    options(obj) {
        this.mailOptions = obj;
    }

    send(obj = null) {
        if (obj) this.options(obj);

        if (this.mailOptions) {
            this.transporter.sendMail(this.mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
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
            from: `Admin 👻 <${admin_user}>`, // sender address
            to: admin_user, // list of receivers
            subject: sub +  ' ✔', // Subject line
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

const mailAdmin = new MailerAdmin();

const mail = new MailService();
module.exports = { mail, mailAdmin, MailService };