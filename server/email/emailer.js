const fs = require('fs')
const path = require('path')
const Hogan = require('hogan')
const config = require('../config/config')

const templates = {
    welcome: fs.readFileSync(path.resolve(__dirname) + 'templates/welcome.html', 'utf-8'),
    forgotPassword: fs.readFileSync(path.resolve(__dirname) + 'templates/forgotPassword.html', 'utf-8'),
    verification: fs.readFileSync(path.resolve(__dirname) + 'templates/verification.html', 'utf-8'),
}

const transporter = require('nodemailer').createTransport({
    service: "gmail",
    auth: {
        user: config.email.username,
        pass: config.email.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const defaultMailOptions = (user, subject, compiledEmail, renderOptions) => {
    let mailOptions = {
        from: 'Roll For Init',
        to: user.email,
        subject: subject,
        html: compiledEmail.render(renderOptions)
    };
    return mailOptions;
}

const sendEmail = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

const sendWelcomeEmail = (user) => {
    var compiledEmail = Hogan.compile(templates.welcome)
    var renderOptions = {
        username: user.username,
        logo: config.website.url + '/logo.png', 
        url: config.website.url
    }
    var mailOptions = defaultMailOptions(user, 'Welcome to Roll For Init', compiledEmail, renderOptions);
    sendEmail(mailOptions);
}

const sendForgotPasswordEmail = (user, key) => {
    var compiledEmail = Hogan.compile(templates.forgotPassword)
    var renderOptions = {
        username: user.username,
        website: config.website.url,
        logo: config.website.url + '/logo.png', 
        code: key
    }
    var mailOptions = defaultMailOptions(user, 'Roll For Init: Forgot Password', compiledEmail, renderOptions);
    sendEmail(mailOptions);
}

const sendVerificationEmail = (user, url) => {
    var compiledEmail = Hogan.compile(templates.verification);
    var renderOptions = {
        username: user.username,
        website: config.website.url,
        logo: config.website.url + '/logo.png',
        url: url
    }
    var mailOptions = defaultMailOptions(user, 'Roll For Init: Email Verification Required', compiledEmail, renderOptions);
    sendEmail(mailOptions);
}


module.exports = { sendWelcomeEmail, sendForgotPasswordEmail, sendVerificationEmail }