"use client";

import { useCallback, useState } from "react";
import { useUserModuleStore } from "@/store/user.store";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { toast } from "sonner";
import type { UserModules } from "@/store/user.store";

const moduleToEndpoint: Record<keyof UserModules, string> = {
	education: "education",
	projects: "project",
	experiences: "experience",
	blogs: "blog",
	certifications: "certification",
	socialProfiles: "socialProfile",
	skills: "skill",
	languages: "extra/language",
	extracurriculars: "extra/extracurricular",
	volunteering: "extra/volunteering",
	interests: "extra/interest",
	awardsHonors: "extra/award-honor",
};

export function useUserModules() {
	const token = Cookies.get("token");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setModule, addItem, removeItem } = useUserModuleStore();

	const fetchModule = useCallback(
		async <T extends keyof UserModules>(key: T) => {
			if (!token) return;
			setLoading(true);
			setError(null);
			try {
				const endpoint = moduleToEndpoint[key];
				const res = await axios.get(`/${endpoint}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setModule(key, res.data);
			} catch (err) {
				setError(`Failed to fetch ${key}`);
				toast.error(`Failed to load ${key}`);
			} finally {
				setLoading(false);
			}
		},
		[setModule, token]
	);

	const createModuleItem = useCallback(
		async <T extends keyof UserModules>(
			key: T,
			data: Omit<UserModules[T][number], "_id">
		) => {
			if (!token) return;
			setLoading(true);
			setError(null);
			try {
				const endpoint = moduleToEndpoint[key];
				const res = await axios.post(`/${endpoint}`, data, {
					headers: { Authorization: `Bearer ${token}` },
				});
				addItem(key, res.data.data);
			} catch {
				setError(`Failed to create ${key}`);
			} finally {
				setLoading(false);
			}
		},
		[addItem, token]
	);

	const updateModuleItem = useCallback(
		async <T extends keyof UserModules>(
			key: T,
			id: string,
			data: Partial<UserModules[T][number]>
		) => {
			if (!token) return;
			setLoading(true);
			setError(null);
			try {
				const endpoint = moduleToEndpoint[key];
				await axios.put(`/${endpoint}/${id}`, data, {
					headers: { Authorization: `Bearer ${token}` },
				});
				await fetchModule(key);
			} catch {
				setError(`Failed to update ${key}`);
			} finally {
				setLoading(false);
			}
		},
		[fetchModule, token]
	);

	const deleteModuleItem = useCallback(
		async <T extends keyof UserModules>(key: T, id: string) => {
			if (!token) return;
			setLoading(true);
			setError(null);
			try {
				const endpoint = moduleToEndpoint[key];
				await axios.delete(`/${endpoint}/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				removeItem(key, id);
			} catch {
				setError(`Failed to delete ${key}`);
			} finally {
				setLoading(false);
			}
		},
		[removeItem, token]
	);

	return {
		fetchModule,
		createModuleItem,
		updateModuleItem,
		deleteModuleItem,
		loading,
		error,
	};
}
