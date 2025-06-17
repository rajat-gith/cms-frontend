"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => setIsCollapsed(!isCollapsed);

	return (
		<div className="flex">
			{/* Sidebar */}
			<aside
				className={`
					fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 border-r bg-white transition-all duration-300 ease-in-out
					${isCollapsed ? "w-16" : "w-64"}
				`}
			>
				<div className="relative h-full flex flex-col">
					<Sidebar isCollapsed={isCollapsed} />

					{/* Toggle Arrow Button */}
					<button
						onClick={toggleSidebar}
						className="absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-white border shadow flex items-center justify-center"
					>
						{isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
					</button>
				</div>
			</aside>

			{/* Main content area */}
			<main
				className={`
					transition-all duration-300 ease-in-out
					ml-16 ${!isCollapsed && "md:ml-64"} flex-1
					h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-background
				`}
			>
				{children}
			</main>
		</div>
	);
}
