import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ConnectDB } from './config/db'
// routers
import createCard from './routes/card.route'
import { initialzeWebSocket } from './config/websocket/websocketserver'

dotenv.config()
const app = express()

app.use(cors({
    origin: ["http://localhost:3000","https://task-borad-woad.vercel.app/cards"],
    credentials: true,
}))

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

initialzeWebSocket(server)