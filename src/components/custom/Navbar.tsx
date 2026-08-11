"use client";

import Image from "next/image";
import { CircleUserRound, ChevronDown, UserCircle } from "lucide-react";
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
        router.replace(token ? "/dashboard" : "/");
    };

    return (
        <nav
            className="shrink-0 w-full z-50 border-b border-white/20 bg-background/95"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
            <div className="h-16 px-6 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleLogoClick}
                >
                    <Image
                        src="https://res.cloudinary.com/diuhlq1a4/image/upload/fl_preserve_transparency/v1748511099/cms_brysf0.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </div>

                {isAuthenticated && userProfile && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 pl-2 pr-3 py-2 rounded-full shadow-md transition-all cursor-pointer duration-200">
                                <UserCircle className="w-7 h-7" />   {/* cleaner circular avatar */}
                                <span className="hidden sm:block text-base font-medium">
                                    {userProfile.username ?? "User"}
                                </span>
                                <ChevronDown className="w-4 h-4 opacity-60" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="bg-muted dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 w-40"
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
                )}
            </div>
        </nav>
    );
}