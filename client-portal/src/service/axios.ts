import axios from "axios";
import { useAuthStore } from "@/store/useAuthstore";

export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:80/api",
    headers: {
        "Content-Type": "application/json",
    },
});



API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


