const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

async function sendOtpMail(email, otp) {
  if (!process.env.MAIL_USER) {
    throw new Error("MAIL_USER is missing in .env");
  }

  if (!process.env.MAIL_APP_PASSWORD) {
    throw new Error(
      "MAIL_APP_PASSWORD is missing in .env"
    );
  }

  const mailOptions = {
    from: `"Netflix Admin" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Netflix Admin Password Reset OTP",

    html: `
      <div style="
        max-width: 520px;
        margin: 0 auto;
        padding: 30px;
        background: #141414;
        color: #ffffff;
        font-family: Arial, sans-serif;
        border-radius: 12px;
      ">
        <h1 style="
          margin: 0 0 20px;
          color: #e50914;
        ">
          NETFLIX ADMIN
        </h1>

        <h2 style="margin-bottom: 12px;">
          Password Reset Verification
        </h2>

        <p style="
          color: #b3b3b3;
          line-height: 1.6;
        ">
          Use the following 4-digit OTP to confirm your
          admin password reset.
        </p>

        <div style="
          margin: 28px 0;
          padding: 18px;
          background: #242424;
          border-radius: 8px;
          text-align: center;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 10px;
          color: #ffffff;
        ">
          ${otp}
        </div>

        <p style="
          color: #b3b3b3;
          line-height: 1.6;
        ">
          This OTP expires in 10 minutes. Do not share
          this code with anyone.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOtpMail;