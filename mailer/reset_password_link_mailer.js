var nodemailer = require("nodemailer");
const user = process.env.YAHOO_USER_ID;
const password = process.env.YAHOO_PASSWORD;
// console.log(user, password);
const resetPasswordLinkMailer = async (email, resetPasswordLink) => {
  // let mailResponse = null;
  var transporter = nodemailer.createTransport({
    host: "smtp.bizmail.yahoo.com",
    port: 587,
    service: "yahoo",
    secure: true,
    auth: {
      user,
      pass: password,
    },
    debug: false,
    logger: true,
  });

  var mailOptions = {
    from: process.env.YAHOO_USER_ID,
    to: email,
    subject: "One Time Reset Password Link",
    html: `<p>Please click <a href="${resetPasswordLink}">here</a> to reset your password</p>
            <p>Also this link is valid for only 15 minutes.</p>
            `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // mailResponse = info.response;
    }
  });
  // return mailResponse;
};

// export mailer function so that we can  use it in other file
module.exports = resetPasswordLinkMailer;
