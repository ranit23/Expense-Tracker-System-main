import { set, connect } from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

const db = async () => {
    try {
        set('strictQuery', false)
        await connect(process.env.MONGO_URL)
        console.log('Db Connected')
    } catch (error) {
        console.log('DB Connection Error');
    }
}

export {db}