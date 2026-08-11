"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signupSchema } from "@/utils/validations";
import { z } from "zod";
import { Loader2 } from "lucide-react";

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
	const { signup, googleSignup } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof SignupFormData, string>>
	>({});

	const handleSignup = async () => {
		const result = signupSchema.safeParse({ email, password });

		if (!result.success) {
			const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
			result.error.errors.forEach((err) => {
				const field = err.path[0] as keyof SignupFormData;
				fieldErrors[field] = err.message;
			});
			setErrors(fieldErrors);
			toast.error("Please fix the errors and try again.");
			return;
		}

		setErrors({});
		setLoading(true);
		try {
			await signup({ email, password });
			toast.success("Account created successfully!");
			router.push("/dashboard");
		} catch (err) {
			console.error(err);
			toast.error("Signup failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignup = async () => {
		if (loading) return;
		setLoading(true);
		try {
			await googleSignup();
		} catch (err) {
			console.error(err);
			toast.error("Google signup failed. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-100">
			{/* Added mx-4 for mobile padding */}
			<div className="relative w-full max-w-sm mx-4 bg-white p-6 rounded-xl shadow-md space-y-6">
				{loading && (
					<div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
						<Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
					</div>
				)}

				<h2 className="text-2xl font-bold text-center text-gray-800">
					Create an Account
				</h2>

				<div className="space-y-4">
					{/* Email Field */}
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

					{/* Password Field */}
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
							className={`mt-1 w-full px-3 py-2 border rounded-md focus:ring ${password.length === 0
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

					{/* Sign Up Button */}
					<Button
						className="w-full bg-indigo-600 text-white py-2 cursor-pointer rounded-md hover:bg-indigo-700 disabled:opacity-50"
						onClick={handleSignup}
						disabled={loading}
					>
						{loading ? "Signing up..." : "Sign Up"}
					</Button>

					{/* Divider */}
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

					{/* Google Button */}
					<Button
						className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
						onClick={handleGoogleSignup}
						disabled={loading}
						variant="outline"
					>
						<FcGoogle className="text-xl" />
						Sign up with Google
					</Button>

					{/* Login Link */}
					<p className="text-center text-sm text-gray-500">
						Already have an account?{" "}
						<span
							className="text-indigo-600 hover:underline cursor-pointer"
							onClick={() => !loading && router.push("/auth/login")}
						>
							Log in
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
