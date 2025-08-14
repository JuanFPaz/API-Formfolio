const nodemailer = require("nodemailer");
const {google} = require('googleapis')
const OAuth2 = google.auth.OAuth2

const accountTransport = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_ID,
    refreshToken: process.env.REFRESH_TOKEN
  } 
};

const mail_rover = async(cb)=>{
  const oauth2Client = new OAuth2(accountTransport.auth.clientId, accountTransport.auth.clientSecret, 'https://developers.google.com/oauthplayground')
  oauth2Client.setCredentials({
    refresh_token: accountTransport.auth.refreshToken,
    tls: {
      rejectUnauthorized: false
    }
  })
  oauth2Client.getAccessToken((err,token)=>{
    if(err) return console.log('Hola!');

    accountTransport.auth.accessToken = token
    cb(nodemailer.createTransport(accountTransport))
  })
}

module.exports = mail_rover;
