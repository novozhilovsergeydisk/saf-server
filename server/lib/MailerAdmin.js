'use strict';

const nodemailer = require('nodemailer');


class MailerAdmin{
    async send(text, sub) {
        // async..await is not allowed in global scope, must use a wrapper
        // async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();
        const email = '@yandex.ru';

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: email, // generated ethereal user
                pass: '', // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `Admin 👻 <${email}>`, // sender address
            to: email, // list of receivers
            subject: sub +  ' ✔', // Subject line
            text: text, // plain text body
            html: text, // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        // main().catch(console.error);
    }

    async sendMessage(text, sub) {
        this.send(JSON.stringify(text), sub);
    }
}

const mailAdmin = new MailerAdmin();

module.exports = mailAdmin;