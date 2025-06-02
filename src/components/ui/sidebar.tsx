"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_MENU_ITEMS } from "@/utils/constants";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
	const pathname = usePathname();
	const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
		{}
	);

	const toggleMenu = (label: string) => {
		setExpandedMenus((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	return (
		<aside className="w-64 h-[calc(100vh-64px)] bg-muted text-muted-foreground px-4 py-6 border-r">
			<nav className="space-y-4">
				{SIDEBAR_MENU_ITEMS.map(
					({ label, icon: Icon, href, children }) => {
						const isExpanded = expandedMenus[label];
						const isActiveParent = pathname === href;
						const hasChildren =
							Array.isArray(children) && children.length > 0;

						return (
							<div key={label}>
								{hasChildren ? (
									<button
										onClick={() => toggleMenu(label)}
										className={cn(
											"w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
											isActiveParent
												? "bg-primary text-white"
												: "hover:bg-accent hover:text-accent-foreground"
										)}
										type="button"
									>
										<span className="flex items-center gap-3">
											<Icon className="w-4 h-4" />
											{label}
										</span>
										{isExpanded ? (
											<ChevronDown className="w-4 h-4" />
										) : (
											<ChevronRight className="w-4 h-4" />
										)}
									</button>
								) : (
									<Link
										href={href}
										className={cn(
											"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
											isActiveParent
												? "bg-primary text-white"
												: "hover:bg-accent hover:text-accent-foreground"
										)}
									>
										<Icon className="w-4 h-4" />
										<span>{label}</span>
									</Link>
								)}

								{/* Children menu */}
								{hasChildren && isExpanded && (
									<div className="ml-6 mt-1 flex flex-col space-y-1">
										{children.map(
											({
												label: childLabel,
												href: childHref,
											}) => {
												const isActiveChild =
													pathname === childHref;
												return (
													<Link
														key={childLabel}
														href={childHref}
														className={cn(
															"px-3 py-1 rounded-md text-sm transition-colors",
															isActiveChild
																? "bg-primary text-white"
																: "hover:bg-accent hover:text-accent-foreground"
														)}
													>
														{childLabel}
													</Link>
												);
											}
										)}
									</div>
								)}
							</div>
						);
					}
				)}
			</nav>
		</aside>
	);
}
