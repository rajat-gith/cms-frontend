"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useEffect } from "react";

export function UserProvider({ children }: { children: React.ReactNode }) {
	const { fetchProfile, userProfile } = useUserProfile();

	useEffect(() => {
		if (!userProfile) {
			fetchProfile();
		}
	}, [userProfile, fetchProfile]);

	return <>{children}</>;
}
