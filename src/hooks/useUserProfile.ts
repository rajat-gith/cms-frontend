"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { UserProfile } from "@/types";

export function useUserProfile() {
    const router = useRouter();
    const { userProfile, setUserProfile } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            const pathname = window.location.pathname;
            const publicRoutes = ["/", "/auth/login", "/auth/signup"];

            if (!token) {
                if (!publicRoutes.includes(pathname)) {
                    router.replace("/auth/login");
                }
                return;
            }

            const response = await axios.get("/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                validateStatus: () => true,
            });

            if (response.status === 403) {
                if (!publicRoutes.includes(pathname)) {
                    router.replace("/auth/login");
                }
                return;
            }

            const userResponse = response.data.data;
            if (userResponse) {
                setUserProfile(userResponse);
            } else {
                throw new Error("User not found");
            }
        } catch (err) {
            setError("Failed to load profile");
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [router, setUserProfile]);

    const updateProfile = useCallback(
        async (updatedData: Partial<UserProfile>) => {
            setLoading(true);
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("No auth token found");

                const response = await axios.put<{ data: UserProfile }>(
                    "/user/profile",
                    updatedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUserProfile(response.data.data);
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
        [setUserProfile]
    );

    return { userProfile, loading, error, updateProfile, fetchProfile };
}
