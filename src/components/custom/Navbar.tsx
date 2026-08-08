"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { userProfile, clearUserProfile, isAuthenticated } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        clearUserProfile();
        router.replace("/auth/login");
    };

    const handleLogoClick = () => {
        const token = Cookies.get("token");
        if (token) {
            router.replace("/dashboard");
        } else {
            router.replace("/");
        }
    };

    return (
        <div className="w-full h-16 flex items-center px-6 sticky top-0 z-50">
            <nav className="fixed top-0 left-0 w-full px-6 py-3 flex items-center justify-between z-50 border-b border-white/20">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleLogoClick}
                >
                    <Image
                        src="https://res.cloudinary.com/diuhlq1a4/image/upload/fl_preserve_transparency/v1748511099/cms_brysf0.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                </div>

                {isAuthenticated && userProfile && (
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 text-black dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer duration-200">
                                    <Menu className="w-6 h-6" />
                                    <span className="hidden sm:block text-lg font-medium">
                                        Hi, {userProfile.username ?? "User"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-muted dark:bg-gray-900 shadow-lg rounded-lg backdrop-blur-md border border-gray-200 dark:border-gray-700 p-2 w-40"
                            >
                                <DropdownMenuItem
                                    onClick={() => router.push("/profile")}
                                    className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 transition"
                                >
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded-md px-3 py-2 transition"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </nav>
        </div>
    );
}
