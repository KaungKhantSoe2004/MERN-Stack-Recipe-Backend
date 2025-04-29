const nodemailer = require("nodemailer");
import Blog from "../models/Blog";
import path from "path";
const ejs = require("ejs");
const sendMail = async (allUsers: any, user: any, newBlog: any) => {
  const userName: string | undefined = user.name;
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "47c74f692ddcbf",
      pass: "89e8d85ef02771",
    },
  });

  const filePath = path.join(__dirname, "../views/emailTemplate.ejs");
  const emailData = await ejs.renderFile(filePath, {
    userName,
    recipeName: newBlog.title,
  });
  for (const eachUser of allUsers) {
    try {
      const mailOptions = {
        from: "kaungkhants892@gmail.com",
        to: eachUser.email,
        subject: "Creating New Recipe",
        html: emailData,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${eachUser.email}`);

      // Add delay to avoid rate limits (1 second per email)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (emailError) {
      console.error(`Failed to send email to ${eachUser.email}:`, emailError);
      // Continue to next email even if one fails
    }
  }
};
export default sendMail;
