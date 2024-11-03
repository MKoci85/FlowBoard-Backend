import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string 
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user: IEmail ) => {
        await transporter.sendMail({
            from: 'FlowBoard <no-reply@flowboard.com>',
            to: user.email,
            subject: 'Verify your email',
            text: 'Please verify your email',
            html: `<p>Hi, ${user.name}. Please verify your email by clicking <a href="${process.env.FRONTEND_URL}/auth/verify-email">here</a> and entering the following code: ${user.token}</p>
                    <p>This link will expire in 15 minutes</p>            
            `

        })
    }

    static sendPasswordResetToken = async ( user: IEmail ) => {
        await transporter.sendMail({
            from: 'FlowBoard <no-reply@flowboard.com>',
            to: user.email,
            subject: 'Reset your password',
            text: 'Please reset your password',
            html: `<p>Hi, ${user.name}. You have requested to reset your password. Please reset your password by clicking <a href="${process.env.FRONTEND_URL}/auth/new-password">here</a> 
                    and entering the following code: ${user.token}</p>
                    <p>This link will expire in 15 minutes</p>            
            `

        })
    }
}