const Mailgen = require("mailgen");
import nodemailer from "nodemailer";

// * creating a nodemailer transport this is the method used for every request
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASS,
  },
});

const sendEmail = async (options) => {
  // Initialize mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Universal Ecommerce",
      link: "shahilkv.com",
    },
  });

  const emailContent = options.mailgenContent; // Assuming mailgenContent is an object

  // Generate HTML content from mailgenContent
  const emailBody = mailGenerator.generate(emailContent);

  // Assign the generated HTML content to the 'html' property
  options.html = emailBody;

  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error);
    console.log(error);
  }
};

const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our app! We're very excited to have you on board.",
      action: {
        instructions:
          "To verify your email please click on the following button:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendEmail, emailVerificationMailgenContent };
