const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (msg) => {
    try {
        sgMail.send(msg);
    } catch (error) {
        console.log(error)
        console.log('Failed to send email')
    }
}

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'Tim Paulaskas<drookue@gmail.com>',
        subject: 'Welcome for joining Task Manager',
        text: `Thank you for joining, ${name}. Please let us know how you enjoy it.`,
        html: `Thank you for joining, </strong>${name}</strong>. Please let us know how you enjoy it.`,
    };
    sendEmail(msg)
}

const sendCancelEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'Tim Paulaskas<drookue@gmail.com>',
        subject: 'Goodbye from Task Manager',
        text: `Per your request, ${name},  we deleted your account.`,
        html: `Per your request, ${name},  we deleted your account`,
    };
    sendEmail(msg)
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}