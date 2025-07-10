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

			// Check if response contains token (direct registration) or requires OTP
			if (response.data.token) {
				const token = response.data.token;
				await postLogin(token);
			} else {
				// OTP was sent, don't redirect yet
				return response.data;
			}
		} catch (error) {
			throw new Error("Signup failed");
		}
	};

	const verifyOTP = async (email: string, otp: string) => {
		try {
			const response = await axios.post("/auth/verify-otp", {
				email,
				otp,
			});
			const token = response.data.token;
			await postLogin(token);
		} catch (error) {
			throw new Error("OTP verification failed");
		}
	};

	const resendOTP = async (email: string) => {
		try {
			await axios.post("/auth/resend-otp", {
				email,
			});
		} catch (error) {
			throw new Error("Failed to resend OTP");
		}
	};

	const handleGoogleSuccess = async (authResult: any) => {
		console.log(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI);
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
		verifyOTP,
		resendOTP,
		googleSignup,
		googleLogin: googleSignup,
	};
}
