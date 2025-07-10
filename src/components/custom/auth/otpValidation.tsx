"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

interface OTPValidationProps {
	email: string;
	onVerify: (otp: string) => Promise<void>;
	onResend: () => Promise<void>;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}

export default function OTPValidation({
	email,
	onVerify,
	onResend,
	onBack,
	loading = false,
	error,
}: OTPValidationProps) {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [resendLoading, setResendLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Countdown timer for resend
	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	const handleChange = (index: number, value: string) => {
		if (value.length > 1) return; // Only allow single digit

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").slice(0, 6);
		const newOtp = [...otp];

		for (let i = 0; i < pastedData.length; i++) {
			if (i < 6 && /^\d$/.test(pastedData[i])) {
				newOtp[i] = pastedData[i];
			}
		}
		setOtp(newOtp);
	};

	const handleSubmit = async () => {
		const otpString = otp.join("");
		if (otpString.length === 6) {
			await onVerify(otpString);
		}
	};

	const handleResend = async () => {
		setResendLoading(true);
		try {
			await onResend();
			setCountdown(60);
			setCanResend(false);
		} catch (error) {
			console.error("Resend failed:", error);
		} finally {
			setResendLoading(false);
		}
	};

	const isComplete = otp.every((digit) => digit !== "");

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="text-center space-y-2">
				<div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
					<Mail className="w-6 h-6 text-blue-600" />
				</div>
				<CardTitle className="text-2xl font-bold">
					Verify Your Email
				</CardTitle>
				<CardDescription className="text-sm text-gray-600">
					We've sent a 6-digit code to
					<br />
					<span className="font-semibold text-gray-900">{email}</span>
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-6">
					<div className="flex justify-center gap-2">
						{otp.map((digit, index) => (
							<Input
								key={index}
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={digit}
								onChange={(e) =>
									handleChange(index, e.target.value)
								}
								onKeyDown={(e) => handleKeyDown(index, e)}
								onPaste={handlePaste}
								disabled={loading}
								className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 focus:ring-blue-500"
								placeholder="0"
							/>
						))}
					</div>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Button
						onClick={handleSubmit}
						disabled={!isComplete || loading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
								Verifying...
							</>
						) : (
							"Verify Code"
						)}
					</Button>
				</div>

				<div className="text-center space-y-4">
					<div className="text-sm text-gray-600">
						Didn't receive the code?{" "}
						{canResend ? (
							<button
								onClick={handleResend}
								disabled={resendLoading}
								className="text-blue-600 hover:text-blue-800 font-semibold disabled:opacity-50"
							>
								{resendLoading ? "Sending..." : "Resend Code"}
							</button>
						) : (
							<span className="text-gray-400">
								Resend in {countdown}s
							</span>
						)}
					</div>

					<button
						onClick={onBack}
						disabled={loading}
						className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Sign Up
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
