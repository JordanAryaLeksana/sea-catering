import axios from "axios";
import cookies from "js-cookie";
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? cookies.get('token') : null;
        if (token) {
            config.headers.Authorization = token ? `Bearer ${token}` : '';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


export default axiosClient;