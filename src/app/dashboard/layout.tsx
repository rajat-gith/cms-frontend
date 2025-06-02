import Sidebar from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex">
			<aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r bg-white z-40">
				<Sidebar />
			</aside>

			<main className="ml-64 flex-1 h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-background">
				{children}
			</main>
		</div>
	);
}
