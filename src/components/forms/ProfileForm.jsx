"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfileForm() {
	const { user, loading, error, updateProfile } = useUserProfile();
	const [formData, setFormData] = useState(user ?? null);

	useEffect(() => {
		if (user) setFormData(user);
	}, [user]);

	if (loading || !formData) {
		return <div>Loading profile...</div>;
	}
	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name.startsWith("location.")) {
			const locKey = name.split(".")[1];
			setFormData((prev) =>
				prev
					? {
							...prev,
							location: {
								...prev.location,
								[locKey]: value,
							},
						}
					: prev
			);
		} else {
			setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData) return;

		try {
			await updateProfile(formData);
			window.location.reload()
		} catch {
			toast.error("Failed to update profile");
		}
	};

	if (loading || !formData) {
		return <div className="p-6 max-w-3xl mx-auto">Loading profile...</div>;
	}

	if (error) {
		return (
			<div className="p-6 max-w-3xl mx-auto text-red-600">
				Error loading profile: {error}
			</div>
		);
	}
	return (
		<form
			className="space-y-4 p-6 max-w-3xl mx-auto"
			onSubmit={handleSubmit}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					name="first_name"
					value={formData.first_name || ""}
					onChange={handleChange}
					placeholder="First Name"
				/>
				<Input
					name="middle_name"
					value={formData.middle_name || ""}
					onChange={handleChange}
					placeholder="Middle Name"
				/>
				<Input
					name="last_name"
					value={formData.last_name || ""}
					onChange={handleChange}
					placeholder="Last Name"
				/>
				<Input
					name="username"
					value={formData.username || ""}
					onChange={handleChange}
					placeholder="Username"
				/>
				<Input
					name="email"
					value={formData.email || ""}
					onChange={handleChange}
					placeholder="Email"
					disabled
				/>
				<Input
					name="phone"
					value={formData.phone || ""}
					onChange={handleChange}
					placeholder="Phone"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Input
					name="location.country"
					value={formData.location?.country || ""}
					onChange={handleChange}
					placeholder="Country"
				/>
				<Input
					name="location.state"
					value={formData.location?.state || ""}
					onChange={handleChange}
					placeholder="State"
				/>
				<Input
					name="location.city"
					value={formData.location?.city || ""}
					onChange={handleChange}
					placeholder="City"
				/>
			</div>

			<Input
				name="linkedinURL"
				value={formData.linkedinURL || ""}
				onChange={handleChange}
				placeholder="LinkedIn URL"
			/>
			<Input
				name="githubURL"
				value={formData.githubURL || ""}
				onChange={handleChange}
				placeholder="GitHub URL"
			/>

			<Textarea
				name="about"
				value={formData.about || ""}
				onChange={handleChange}
				placeholder="Tell us about yourself..."
			/>

			<Button type="submit" className="w-full md:w-fit">
				Save Profile
			</Button>
		</form>
	);
}
