"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/user.store";
import { useUserProfile } from "@/hooks/useUserProfile";

interface AuthCredentials {
	email: string;
	password: string;
}

export function useAuth() {
	const router = useRouter();
	const { setIsAuthenticated } = useUserStore();
	const { fetchProfile } = useUserProfile();

	const storeToken = (token: string) => {
		Cookies.set("token", token, {
			expires: 7, // days
			sameSite: "Lax",
		});
	};

	const postLogin = async (token: string) => {
		storeToken(token);
		setIsAuthenticated(true);
		await fetchProfile();
		router.push("/dashboard");
	};

	const login = async ({ email, password }: AuthCredentials) => {
		try {
			const response = await axios.post("/auth/login", {
				email,
				password,
			});
			const token = response.data.token;
			await postLogin(token);
		} catch (error) {
			throw new Error("Login failed");
		}
	};

	const signup = async ({ email, password }: AuthCredentials) => {
		try {
			const response = await axios.post("/auth/register", {
				email,
				password,
			});
			const token = response.data.token;
			await postLogin(token);
		} catch (error) {
			throw new Error("Signup failed");
		}
	};

	const handleGoogleSuccess = async (authResult: any) => {
		if (authResult?.code) {
			try {
				const response = await axios.post("/auth/google", {
					code: authResult.code,
				});
				const token = response.data.token;
				await postLogin(token);
			} catch (err) {
				console.error("Google auth error", err);
			}
		}
	};

	const googleSignup = useGoogleLogin({
		onSuccess: handleGoogleSuccess,
		onError: (err) => {
			console.error("Google login failed", err);
		},
		flow: "auth-code",
	});

	return {
		login,
		signup,
		googleSignup,
		googleLogin: googleSignup,
	};
}
