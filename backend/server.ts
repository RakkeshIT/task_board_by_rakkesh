import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server Start with PORT - ${PORT}`);
    
})