import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import config from "../helper/config";
const { MG_API_KEY, MG_DOMAIN } = config;

const mgAuth = {
	auth: {
		api_key: MG_API_KEY,
		domain: MG_DOMAIN,
	},
};

const emailTemplateSource = fs.readFileSync(
	path.join(__dirname, "../views/template.hbs"),
	"utf8"
);

const smtpTransporter = nodemailer.createTransport(mg(mgAuth));
const template = handlebars.compile(emailTemplateSource);

export const htmlToSend = (message) => template({ message });

export const sendMail = (email, subject, text, html) => {
	const mailOptions = {
		from: "YOUR_EMAIL_HERE@gmail.com", // TODO replace this with your own email
		to: email, // TODO: the receiver email has to be authorized for the free tier
		subject,
		text,
		html: html,
	};

	smtpTransporter
		.sendMail(mailOptions)
		.then(() => {
			console.log("Email sent");
		})
		.catch((err) => {
			console.log("Email not sent", err);
		});
};
