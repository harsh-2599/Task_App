const nodemailer = require('nodemailer')
const {mail,password} = require('./../../imp');

const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port : 465 ,
        secure: true, // true for 465, false for other ports
        auth: {
        user: mail, // generated ethereal user
        pass: password, // generated ethereal password
        },
    });

const sendEmail = async (destEmail,text) => {
    await transporter.sendMail({
        from: mail, // sender address
        to: destEmail, // list of receivers
        subject: "Hello from nodemailer", // Subject line
        html: `${text}`, // html body
    });
} 

module.exports = sendEmail;