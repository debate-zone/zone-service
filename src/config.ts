import { createConfig } from "express-zod-api"
import 'dotenv/config'
import mongoose from "mongoose"


export const config = createConfig({
    server: {
        listen: process.env.PORT || 8000,
    },
    cors: true,
    logger: {
        level: "debug",
        color: true,
    },
    startupLogo: false,
})

const uri = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}
:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`.trim()


mongoose.connect(uri, {})
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(e => {
        console.log("Error connecting to MongoDB", e)
    })

