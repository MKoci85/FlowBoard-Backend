import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/register', 
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/verify-email',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.verifyEmail
)

router.post('/login',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Wrong password'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-code',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.verifyCode
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Invalid Token'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.getUser
)


/** Profile */

router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/change-password',
    authenticate,
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router