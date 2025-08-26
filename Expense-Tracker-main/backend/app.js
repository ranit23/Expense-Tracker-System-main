import express, { json } from 'express';
import cors from 'cors';
import {db} from './db/db.js';
import { readdirSync } from 'fs';
import dotenv from "dotenv"
import transectionRoute from './routes/transactions.js';
import userRoute from './routes/user.js';
import billRoute from './routes/bills.js';

const app = express()

dotenv.config()

const PORT = process.env.PORT || 8787

//middlewares
app.use(json())
app.use(cors({
    origin: '*',
}));
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded files

//routes
app.use("/api/v1/transections",transectionRoute)
app.use("/api/v1/users",userRoute)
app.use("/api/v1/bills",billRoute)
app.get("/",(req,res)=>{
    res.send("hello")
})



const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()