"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU_ITEMS } from "@/utils/constants";

interface SidebarProps {
    isCollapsed: boolean;
    onNavigate?: () => void;
}

export default function Sidebar({ isCollapsed, onNavigate }: SidebarProps) {
    const pathname = usePathname();

    const isActivePath = (href: string) => {
        return pathname === href;
    };

    return (
        <div
            className={cn(
                "h-full bg-muted text-muted-foreground py-6 transition-all duration-300 ease-in-out",
                isCollapsed ? "px-2" : "px-4"
            )}
        >
            <nav className="space-y-2">
                {SIDEBAR_MENU_ITEMS.map(({ label, icon: Icon, href }) => {
                    const isActive = href ? isActivePath(href) : false;

                    return (
                        <Link
                            key={label}
                            href={href || "#"}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-white"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="truncate">{label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
