var nodemailer = require("nodemailer");
const user = process.env.YAHOO_USER_ID;
const password = process.env.YAHOO_PASSWORD;
// console.log(user, password);
const passwordMailer = async (email, name, random_password) => {
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
    from: "rajnishpatel203@yahoo.com",
    to: email,
    subject: "Login credentials ",
    html: `Welcome <strong>${name}! </strong> you are registerd! <p>Your one time password is <strong>${random_password}</strong> </p> <p> Please login <a href="https://library-management-system-lms1.herokuapp.com//login">here</a> and change your password immediately.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
// const message = passwordMailer("rajnish17100042@gmail.com").catch(
//   console.error
// );
// console.log(message);

// export mailer function so that we can  use it in other file
module.exports = passwordMailer;
