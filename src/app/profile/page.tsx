"use client";

import { useUserProfile } from "@/hooks/useUserProfile"; // wherever you put this hook
import ProfileForm from "@/components/forms/ProfileForm";
import { Loader } from "@/components/ui/loader";

export default function ProfilePage() {
	const { loading, error } = useUserProfile();

	if (loading) {
		return (
			<main className="min-h-screen py-10 px-4 md:px-8 text-center">
				<Loader />
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen py-10 px-4 md:px-8 text-center text-destructive mt-10">
				Unauthorized: Please login
			</main>
		);
	}

	return (
		<main className="min-h-screen py-10 px-4 md:px-8">
			<h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>
			<ProfileForm />
		</main>
	);
}
