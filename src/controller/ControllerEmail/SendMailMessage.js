const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = "440349351263-hcnndmcqk12v46hsl732q472ajtgjtck.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04_wiivIlFJUACgYIARAAGAQSNwF-L9IrHsyFSQAF_EiJaItfoCLYrKYwh8hzx8k5duXOPKiTR1cMgjzF6vibNCY92J6F_3F4eNI";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMailMessage = async (email, message) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'quanggraduationproject@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const info = await transport.sendMail({
            from: `'"Apex Fashion" <quanggraduationproject@gmail.com>'`, // sender address
            to: email, // list of receivers
            subject: 'Thanks', // Subject line
            text: 'Hello world?', // plain text body
            html: `<b>
             ${message}</b>`,
        });
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

module.exports = sendMailMessage;
