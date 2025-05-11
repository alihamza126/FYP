import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import UserModel from '../models/User.js'
import { generateEmailHTML } from './mail.template.js'

export const sendEmail = async ({ email, emailType, userId, username }) => {
	try {
		// create a hased token
		const hashedToken = await bcryptjs.hash(userId.toString(), 10)

		if (emailType === 'VERIFY') {
			await UserModel.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			})
		} else if (emailType === 'RESET') {
			await UserModel.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			})
		}

		// Looking to send emails in production? Check out our Email API/SMTP product!
		var transport = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "a4a4af3e0cbd7f",
				pass: "c8d2a5aabb9f20"
			}
		});

		const mailOptions = {
			from: 'alihamzageo75@mailtrap.com',
			to: email,
			subject:
				emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
			html: generateEmailHTML({
				type: emailType,
				token: hashedToken,
				domain: process.env.DOMAIN,
				username: username,
			})
		}

		const mailresponse = await transport.sendMail(mailOptions)
		return mailresponse
	} catch (error) {
		throw new Error(error.message)
	}
}
