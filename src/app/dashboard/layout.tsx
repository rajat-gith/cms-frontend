"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import { ChevronRight, ChevronLeft, Menu, X } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const pathname = usePathname();

	const toggleSidebar = () => setIsCollapsed(!isCollapsed);

	// Close the mobile drawer any time the route changes
	useEffect(() => {
		setIsMobileOpen(false);
	}, [pathname]);

	return (
		<div className="flex">
			{/* Mobile top bar with menu toggle */}
			<div className="md:hidden fixed top-16 left-0 right-0 z-30 flex items-center h-12 px-4 border-b bg-white">
				<button
					onClick={() => setIsMobileOpen(true)}
					className="flex items-center gap-2 text-sm font-medium"
					aria-label="Open sidebar"
				>
					<Menu size={20} />
					Menu
				</button>
			</div>

			{/* Mobile backdrop */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 md:hidden"
					onClick={() => setIsMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 border-r bg-white transition-all duration-300 ease-in-out
					w-64 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
					md:translate-x-0 ${isCollapsed ? "md:w-16" : "md:w-64"}
				`}
			>
				<div className="relative h-full flex flex-col">
					{/* Mobile close button */}
					<button
						onClick={() => setIsMobileOpen(false)}
						className="md:hidden self-end m-2 p-2 rounded-lg hover:bg-accent"
						aria-label="Close sidebar"
					>
						<X size={18} />
					</button>

					<Sidebar
						isCollapsed={isCollapsed && !isMobileOpen}
						onNavigate={() => setIsMobileOpen(false)}
					/>

					{/* Toggle Arrow Button (desktop collapse) */}
					<button
						onClick={toggleSidebar}
						className="hidden md:flex absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-white border shadow items-center justify-center"
					>
						{isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
					</button>
				</div>
			</aside>

			{/* Main content area */}
			<main
				className={`
					transition-all duration-300 ease-in-out
					ml-0 ${!isCollapsed ? "md:ml-64" : "md:ml-16"} flex-1 w-full min-w-0
					h-[calc(100vh-4rem)] overflow-y-auto p-4 pt-14 md:pt-6 md:p-6 bg-background
				`}
			>
				{children}
			</main>
		</div>
	);
}
