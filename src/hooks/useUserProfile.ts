"use client";

import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { UserProfile } from "@/types";

export function useUserProfile() {
	const { user, setUser } = useUserStore();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			try {
				const token = Cookies.get("token");

				const response = await axios.get("/user/profile", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const userResponse = response.data.data;
				if (userResponse) {
					setUser(userResponse);
				} else {
					throw new Error("User not found");
				}
			} catch (err) {
				setError("Failed to load profile");
				toast.error("Failed to load profile");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [setUser]);

	const updateProfile = useCallback(
		async (updatedData: Partial<UserProfile>) => {
			setLoading(true);
			try {
				const token = Cookies.get("token");
				if (!token) throw new Error("No auth token found");

				const response = await axios.put<UserProfile>(
					"/user/profile",
					updatedData,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setUser(response.data);
				toast.success("Profile updated successfully");
				setError(null);
			} catch (err: unknown) {
				let message = "Failed to load profile";
				if (err instanceof Error) {
					message = err.message;
				}
				setError(message);
				toast.error(message);
			} finally {
				setLoading(false);
			}
		},
		[setUser]
	);

	return { user, loading, error, updateProfile };
}
