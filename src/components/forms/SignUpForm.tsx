"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { validateSignup } from "@/utils/validations";

type SignupFormData = {
    email: string;
    password: string;
};

export default function SignupForm() {
    const { signup, googleSignup } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState<SignupFormData>({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleGoogleSignup = () => {
        if (loading) return;
        googleSignup();
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = validateSignup(form.email, form.password);
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            await signup(form);
            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
                Create an Account
            </h2>

            <form onSubmit={handleSignup} className="space-y-4">
                <Input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    disabled={loading}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                />

                <Input
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    disabled={loading}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300"
                />

                <Button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>

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
                className="w-full flex items-center justify-center gap-2 border py-2 rounded-md text-gray-100 hover:bg-gray-100 hover:text-black cursor-pointer"
                onClick={handleGoogleSignup}
                disabled={loading}
            >
                <FcGoogle className="text-xl" />
                Sign Up with Google
            </Button>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <span
                    className="text-indigo-600 hover:underline cursor-pointer"
                    onClick={() => router.push("/auth/login")}
                >
                    Log in
                </span>
            </p>
        </div>
    );
}
