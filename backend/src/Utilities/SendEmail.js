const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    console.log(process.env.USER);
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
        return true;
    } catch (error) {
        console.log(error, "email not sent");
        return false;

    }
};

module.exports = sendEmail;
