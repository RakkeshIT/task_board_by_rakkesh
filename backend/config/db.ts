import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE!,
    ssl:{
        rejectUnauthorized: false
    }
})

export async function ConnectDB(): Promise<Boolean> {
    try {
        const result = await pool.query("SELECT NOW() as time");
        console.log("DB is Connected! Time: ", result.rows[0].time);
        
        return true
    } catch (error) {
        console.log("DB Connection Failed: ", error);
        return false
    }
}

export default pool