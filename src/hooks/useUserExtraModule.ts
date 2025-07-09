// hooks/useUserExtraModules.ts
import { useEffect } from "react";
import Cookies from "js-cookie";

import { useUserModuleStore } from "@/store/user.store";
import { ExtraModuleType } from "@/types/extra-module.type";
import { extraModulesConfig } from "@/lib/extra-modules-config";
import axios from "@/lib/axios";

export const useUserExtraModules = () => {
	const token = Cookies.get("token");
	if (!token) {
		console.warn("No token found, skipping extra module fetch");
		return;
	}
	const setModule = useUserModuleStore((s) => s.setModule);

	useEffect(() => {
		const fetchAllModules = async () => {
			for (const key of Object.keys(
				extraModulesConfig
			) as ExtraModuleType[]) {
				try {
					const res = await axios.get(`/extra/${key}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setModule(key, res.data.data);
				} catch (err) {
					console.error(`Failed to fetch ${key}`, err);
				}
			}
		};

		fetchAllModules();
	}, [setModule]);
};
