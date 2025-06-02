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
				console.error(`Failed to fetch ${key}:`, err);
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

				console.log(`Create ${key} response:`, res.data);

				let newItem;
				if (res.data?.data) {
					newItem = res.data.data;
				} else if (res.data?._id) {
					newItem = res.data;
				} else {
					console.warn(
						`Unexpected API response structure for ${key}:`,
						res.data
					);
					newItem = res.data;
				}
				if (!newItem?._id) {
					console.error(`Created ${key} item missing _id:`, newItem);
					throw new Error(`Invalid response: missing _id field`);
				}

				addItem(key, newItem);
			} catch (err) {
				console.error(`Failed to create ${key}:`, err);
				setError(`Failed to create ${key}`);
				throw err;
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
				const res = await axios.put(`/${endpoint}/${id}`, data, {
					headers: { Authorization: `Bearer ${token}` },
				});

				console.log(`Update ${key} response:`, res.data);

				await fetchModule(key);
			} catch (err) {
				console.error(`Failed to update ${key}:`, err);
				setError(`Failed to update ${key}`);
				throw err;
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
				const res = await axios.delete(`/${endpoint}/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				console.log(`Delete ${key} response:`, res.data);

				removeItem(key, id);
			} catch (err) {
				console.error(`Failed to delete ${key}:`, err);
				setError(`Failed to delete ${key}`);
				throw err;
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
