// File: components/extra-modules/ExtraModuleDashboard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExtraModuleList } from "./ExtraModuleList";
import { useUserModuleStore } from "@/store/user.store";
import { extraModulesConfig } from "@/lib/extra-modules-config";
import type { ExtraModuleType } from "@/types/extra-module.type";
import { useUserExtraModules } from "@/hooks/useUserExtraModule";

export function ExtraModuleDashboard() {
	const [activeModule, setActiveModule] = useState<ExtraModuleType | null>(
		null
	);
	useUserExtraModules();
	const { modules } = useUserModuleStore();

	const getModuleCount = (type: ExtraModuleType) => {
		return modules[type]?.length || 0;
	};

	const getTotalItems = () => {
		return Object.keys(extraModulesConfig).reduce((total, key) => {
			return total + getModuleCount(key as ExtraModuleType);
		}, 0);
	};

	if (activeModule) {
		return (
			<div className="space-y-4">
				<Button
					variant="ghost"
					onClick={() => setActiveModule(null)}
					className="mb-4"
				>
					← Back to Dashboard
				</Button>
				<ExtraModuleList type={activeModule} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">Extra Modules Dashboard</h1>
				<p className="text-muted-foreground">
					Manage your additional profile information and achievements
				</p>
				<Badge variant="secondary" className="text-sm">
					{getTotalItems()} Total Items
				</Badge>
			</div>

			{/* Module Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Object.entries(extraModulesConfig).map(([key, config]) => {
					const moduleType = key as ExtraModuleType;
					const count = getModuleCount(moduleType);
					const IconComponent = config.icon;

					return (
						<Card
							key={key}
							className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
							onClick={() => setActiveModule(moduleType)}
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div
										className={`p-3 rounded-lg ${config.color} text-white`}
									>
										<IconComponent className="h-6 w-6" />
									</div>
									<Badge variant="secondary">
										{count} {count === 1 ? "item" : "items"}
									</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<h3 className="font-semibold text-lg">
										{config.title}
									</h3>
									<p className="text-sm text-muted-foreground line-clamp-2">
										{config.description}
									</p>
									// Responsive Manage Button
									<Button
										variant="ghost"
										className="w-full mt-3 justify-start p-0 h-auto text-sm font-medium"
									>
										<span className="truncate sm:whitespace-normal">
											Manage {config.title} →
										</span>
									</Button>

								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Quick Stats */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Overview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{Object.entries(extraModulesConfig).map(
							([key, config]) => {
								const count = getModuleCount(
									key as ExtraModuleType
								);
								return (
									<div
										key={key}
										className="text-center space-y-1"
									>
										<div className="text-2xl font-bold">
											{count}
										</div>
										<div className="text-xs text-muted-foreground">
											{config.title}
										</div>
									</div>
								);
							}
						)}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity or Tips */}
			<Card>
				<CardHeader>
					<CardTitle>Tips for Better Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
							<div>
								<p className="text-sm font-medium">
									Add Multiple Languages
								</p>
								<p className="text-xs text-muted-foreground">
									Showcase your multilingual abilities to
									stand out globally
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
							<div>
								<p className="text-sm font-medium">
									Include Volunteer Work
								</p>
								<p className="text-xs text-muted-foreground">
									Highlight your community involvement and
									social responsibility
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
							<div>
								<p className="text-sm font-medium">
									Document Your Interests
								</p>
								<p className="text-xs text-muted-foreground">
									Personal interests help create connections
									with like-minded people
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
							<div>
								<p className="text-sm font-medium">
									List Awards & Honors
								</p>
								<p className="text-xs text-muted-foreground">
									Recognition and achievements demonstrate
									your excellence
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
