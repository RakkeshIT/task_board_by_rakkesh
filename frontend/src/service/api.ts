import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_PROD_URL : process.env.NEXT_PUBLIC_LOCAL_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

console.log(process.env.NEXT_PUBLIC_LOCAL_URL);
console.log(process.env.NODE_ENV);

export const apiService = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    try {
        const {data} = await api(config);
        return data
    } catch (error: any) {
        throw error.response?.data || error
    }
}

export const addData = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    try {
        const {data} = await api(config);
        return data
    } catch (error: any) {
        throw error.response?.data || error
    }
}


export default api;