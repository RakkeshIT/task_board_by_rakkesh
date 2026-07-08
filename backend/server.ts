import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ConnectDB } from './config/db'
// routers
import createCard from './routes/card.route'

dotenv.config()
const app = express()

app.use(cors({
    origin:["*"],
    credentials: true,
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello Server is Start")
})
// API's
app.use('/api', createCard)
const PORT = process.env.PORT || 5000

async function StartServer() {
    const dbConnected = await ConnectDB()
    app.listen(PORT, () => {
        console.log(`Server Start with PORT - ${PORT}`);
        console.log("Is Db is Connected ? -> ", dbConnected ? "Connected": "No Fail");
    })
}

StartServer()
