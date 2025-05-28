import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";

interface AuthCredentials {
	email: string;
	password: string;
}

export function useAuth() {
	const router = useRouter();

	const storeToken = (token: string) => {
		Cookies.set("token", token, {
			expires: 7, // days
			sameSite: "Lax",
		});
	};

	const login = async ({ email, password }: AuthCredentials) => {
		try {
			const response = await axios.post("/auth/login", {
				email,
				password,
			});
			const token = response.data.token;
			storeToken(token);
			router.push("/dashboard");
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
			storeToken(token);
			router.push("/dashboard");
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
				storeToken(token);
				router.push("/dashboard");
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
