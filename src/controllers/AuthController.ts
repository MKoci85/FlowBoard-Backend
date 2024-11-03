import type { Request, Response } from "express"
import User from "../models/User"
import { comparePassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import Token from "../models/Token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            const userExists = await User.findOne({ email })
            if(userExists) {
                res.status(400).json({message: 'User email already exists'})
                return
            }
            // Create user
            const user = new User(req.body)
            // Hash password
            user.password = await hashPassword(password)
            // Create token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('User created successfully, check your email for verification')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    static verifyEmail = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token})
            if(!tokenExists) {
                res.status(404).json({message: 'Invalid token'})
                return
            }
            const user = await User.findById(tokenExists.user)
            if(!user) {
                res.status(404).json({message: 'Invalid token'})
                return
            }
            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Email verified successfully')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email})
            if(!user) {
                res.status(400).json({message: 'User not found'})
                return
            }
            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                res.status(404).json({message: 'Email not verified'})
                return
            }
            const isPasswordValid = await comparePassword(password, user.password)
            if(!isPasswordValid) {
                res.status(404).json({message: 'Wrong password'})
                return
            }

            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email})
            if(!user) {
                res.send('If your email is registered, you will receive a confirmation code')
                return
            }

            if(user.confirmed) {
                res.status(403).json({message: 'User already verified'})
                return
            }
            
            // Create token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('If your email is registered, you will receive a confirmation code')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email})
            if(!user) {
                res.send('If your email is registered, you will receive a password reset code')
                return
            }

            // Create token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // Send email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('If your email is registered, you will receive a password reset code')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }


    static verifyCode = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token})
            if(!tokenExists) {
                res.status(404).json({message: 'Invalid token'})
                return
            }
            res.send('Code verified successfully, set your new password')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const tokenExists = await Token.findOne({ token})
            if(!tokenExists) {
                res.status(404).json({message: 'Invalid token'})
                return
            }
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static getUser = async (req: Request, res: Response) => {
        res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await User.findOne({ email })
        if(userExists && userExists.id.toString() !== req.user.id.toString()) {
            res.status(409).json({message: 'Email already in use'})
            return
        }

        req.user.name = name
        req.user.email = email 
        try {
            await req.user.save()
            res.send('Profile updated successfully')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static updateCurrentPassword = async (req: Request, res: Response) => {
        
        const { current_password, password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordValid = await comparePassword(current_password, user.password)

        if(!isPasswordValid) {
            res.status(401).json({message: 'Wrong password'})
            return
        }

        try {  
            user.password = await hashPassword(password)
            await user.save()
            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordValid = await comparePassword(password, user.password)

        if(!isPasswordValid) {
            res.status(401).json({message: 'Wrong password'})
            return
        }

        res.send('Password is correct')
    }
}