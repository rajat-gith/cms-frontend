"use client";

import { useEffect, useState } from "react";
import { Country } from "country-state-city";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ErrorDisplay } from "../custom/ErrorDisplay";
import { SkeletonLoader } from "../custom/SkeletenLoader";
import { ProfileDisplay } from "../custom/ProfileDisplay";
import { ProfileEditModal } from "../custom/ProfileEditModal";
import { CountryOption } from "@/types/index";

export default function ProfileForm() {
	const { userProfile, loading, error, updateProfile } = useUserProfile();
	const [countries, setCountries] = useState<CountryOption[]>([]);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setCountries(Country.getAllCountries());
	}, []);

	if (loading && !userProfile) return <SkeletonLoader />;
	if (error) return <ErrorDisplay error={error} />;

	return (
		<div className="space-y-6">
			<ProfileDisplay
				user={userProfile}
				onEdit={() => setModalOpen(true)}
			/>
			<ProfileEditModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				user={userProfile}
				onSave={updateProfile}
				countries={countries}
			/>
		</div>
	);
}
