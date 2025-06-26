"use client";

import { useCallback, useState } from "react";
import { useUserModuleStore } from "@/store/user.store";
import Cookies from "js-cookie";
import axios from "@/lib/axios";
import { toast } from "sonner";
import type { UserModules } from "@/store/user.store";

// Separate regular modules from extra modules
const regularModuleToEndpoint: Record<string, string> = {
    education: "education",
    projects: "project",
    experiences: "experience",
    blogs: "blog",
    certification: "certification",
    socialProfiles: "socialProfile",
    skills: "skill",
};

// Extra modules that use the new /extra/:type endpoint
const extraModules = [
    "language",
    "extracurricular",
    "volunteering",
    "interest",
    "awardsHonor",
] as const;

// Map extra module keys to their backend type names
const extraModuleToType: Record<string, string> = {
    language: "language",
    extracurricular: "extracurricular",
    volunteering: "volunteering",
    interest: "interest",
    awardsHonor: "award-honor",
};

// Helper function to determine if a module is an extra module
const isExtraModule = (key: keyof UserModules): boolean => {
    return extraModules.includes(key as any);
};

// Helper function to get the correct endpoint for a module
const getModuleEndpoint = (key: keyof UserModules): string => {
    if (isExtraModule(key)) {
        const type = extraModuleToType[key];
        return `extra/${type}`;
    }
    return regularModuleToEndpoint[key] || key;
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
                const endpoint = getModuleEndpoint(key);
                const res = await axios.get(`/${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(`Fetch ${key} response:`, res.data);
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
            data: Partial<Omit<UserModules[T][number], "_id">>
        ) => {
            if (!token) return;
            setLoading(true);
            setError(null);
            try {
                const endpoint = getModuleEndpoint(key);
                const res = await axios.post(`/${endpoint}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(`Create ${key} response:`, res.data);

                let newItem;

                // For extra modules, the response structure might be different
                if (isExtraModule(key)) {
                    // Try common response structures for extra modules
                    if (res.data?.data) {
                        newItem = res.data.data;
                    } else if (res.data?.result) {
                        newItem = res.data.result;
                    } else if (res.data?._id) {
                        newItem = res.data;
                    }
                } else {
                    // Handle regular modules with existing logic
                    const possibleKeys = ["data", key];
                    for (const responseKey of possibleKeys) {
                        if (res.data?.[responseKey]) {
                            newItem = res.data[responseKey];
                            break;
                        }
                    }

                    // Fallback to direct object if it has _id
                    if (!newItem && res.data?._id) {
                        newItem = res.data;
                    }
                }

                // Last resort - use response as-is
                if (!newItem) {
                    console.warn(
                        `Unexpected API response structure for ${key}:`,
                        res.data
                    );
                    newItem = res.data;
                }

                if (!newItem?._id) {
                    console.error(`Created ${key} item missing _id:`, newItem);
                    console.error(`Full response:`, res.data);
                    throw new Error(`Invalid response: missing _id field`);
                }

                addItem(key, newItem);
                // toast.success(`${key} item created successfully`);
                return newItem;
            } catch (err) {
                console.error(`Failed to create ${key}:`, err);
                setError(`Failed to create ${key}`);
                toast.error(`Failed to create ${key} item`);
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
                const endpoint = getModuleEndpoint(key);
                const res = await axios.put(`/${endpoint}/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(`Update ${key} response:`, res.data);

                // Refresh the module data after update
                await fetchModule(key);
                toast.success(`${key} item updated successfully`);
            } catch (err) {
                console.error(`Failed to update ${key}:`, err);
                setError(`Failed to update ${key}`);
                toast.error(`Failed to update ${key} item`);
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
                const endpoint = getModuleEndpoint(key);
                const res = await axios.delete(`/${endpoint}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(`Delete ${key} response:`, res.data);

                removeItem(key, id);
                toast.success(`${key} item deleted successfully`);
            } catch (err) {
                console.error(`Failed to delete ${key}:`, err);
                setError(`Failed to delete ${key}`);
                toast.error(`Failed to delete ${key} item`);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [removeItem, token]
    );

    // Helper method to fetch all extra modules at once
    const fetchAllExtraModules = useCallback(async () => {
        const promises = extraModules.map((module) => fetchModule(module));
        await Promise.allSettled(promises);
    }, [fetchModule]);

    // Helper method to check if a module type is supported
    const isModuleSupported = useCallback(
        (key: string): key is keyof UserModules => {
            return (
                key in regularModuleToEndpoint ||
                extraModules.includes(key as any)
            );
        },
        []
    );

    return {
        fetchModule,
        createModuleItem,
        updateModuleItem,
        deleteModuleItem,
        fetchAllExtraModules,
        isModuleSupported,
        isExtraModule: (key: keyof UserModules) => isExtraModule(key),
        loading,
        error,
    };
}
