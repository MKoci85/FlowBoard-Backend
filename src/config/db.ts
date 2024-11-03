import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.white.bgGreen.bold(`Connected to MongoDB at ${url}`))
    } catch (error) {
        console.log(colors.white.bgRed.bold('Error connecting to MongoDB'))
        process.exit(1)
    }
}
