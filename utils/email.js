const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(owner, url) {
    this.to = "barber@gmail.com";
    this.firstName = owner.name;
    this.url = url;
    this.from = `Mateusz Banicki <${owner.email}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production")
      return nodemailer.createTransport({
        host: process.env.BREVO_EMAIL_HOST,
        port: process.env.BREVO_EMAIL_PORT,
        auth: {
          user: process.env.BREVO_EMAIL_LOGIN,
          pass: process.env.BREVO_EMAIL_SMTP_KEY,
        },
      });

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_EMAIL_HOST,
      port: process.env.MAILTRAP_EMAIL_PORT,
      auth: {
        user: process.env.MAILTRAP_EMAIL_USER,
        pass: process.env.MAILTRAP_EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      // html,
      text: this.url,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Twój token do resetu hasła (ważny przez 10 minut)"
    );
  }
};
