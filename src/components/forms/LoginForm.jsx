"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/utils/validations";

export default function LoginForm() {
	const router = useRouter();
	const { login, googleLogin } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleLogin = async () => {
		const result = loginSchema.safeParse({ email, password });

		if (!result.success) {
			const fieldErrors = {};
			result.error.errors.forEach((err) => {
				const field = err.path[0];
				fieldErrors[field] = err.message;
			});
			setErrors(fieldErrors);
			toast.error("Please fix the errors and try again.");
			return;
		}

		setErrors({});
		setLoading(true);
		try {
			await login({ email, password });
			toast.success("Logged in successfully!");

			router.push("/dashboard");
		} catch (err) {
			console.error(err);
			toast.error("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		if (!loading) {
			googleLogin();
		}
	};

	return (
		<div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-6">
			<h2 className="text-2xl font-bold text-center text-gray-800">
				Login
			</h2>

			<div className="space-y-4">
				<div>
					<Label htmlFor="email" className="text-sm text-gray-600">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						value={email}
						disabled={loading}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
					/>
					{errors.email && (
						<p className="text-sm text-red-500 mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="password" className="text-sm text-gray-600">
						Password
					</Label>
					<Input
						id="password"
						type="password"
						placeholder="********"
						value={password}
						disabled={loading}
						onChange={(e) => setPassword(e.target.value)}
						className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring ${
							password.length === 0
								? "border-gray-300"
								: errors.password
									? "border-red-500 focus:ring-red-300"
									: "border-green-500 focus:ring-green-300"
						}`}
					/>
					{errors.password && (
						<p className="text-sm text-red-500 mt-1">
							{errors.password}
						</p>
					)}
				</div>

				<Button
					className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
					onClick={handleLogin}
					disabled={loading}
				>
					{loading ? "Signing in..." : "Sign In"}
				</Button>

				<div className="relative my-4">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="bg-white px-2 text-gray-500">
							Or continue with
						</span>
					</div>
				</div>

				<Button
					className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
					onClick={handleGoogleLogin}
					disabled={loading}
				>
					<FcGoogle className="text-xl" />
					Sign in with Google
				</Button>

				<p className="text-center text-sm text-gray-500">
					Don't have an account?{" "}
					<span
						className="text-indigo-600 hover:underline cursor-pointer"
						onClick={() => !loading && router.push("/signup")}
					>
						Sign Up
					</span>
				</p>
			</div>
		</div>
	);
}
