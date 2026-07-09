import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ConnectDB } from './config/db'
// routers
import createCard from './routes/card.route'
import { initializeWebSocket } from './config/websocket/websocketserver'

dotenv.config()
const app = express()

const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ["https://task-borad-woad.vercel.app"]
    : ["http://localhost:3000"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello Server is Start")
})
// API's
app.use('/api', createCard)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, async () => {
    const dbConnected = await ConnectDB()
    console.log(`Server Start with PORT - ${PORT}`);
    console.log("Is Db is Connected ? -> ", dbConnected ? "Connected" : "No Fail");
})

initializeWebSocket(server)