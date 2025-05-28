// lib/axios.ts
import axios from "axios";
import { authStore } from "@/store/auth.store";

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
	const token = authStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default instance;
