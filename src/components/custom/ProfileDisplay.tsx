"use client";

import { Button } from "@/components/ui/button";
import { profileFormInputAttributes } from "@/utils/formInputAttributes";
import { ProfileDisplayProps } from "@/types/index";

export const ProfileDisplay = ({ user, onEdit }: ProfileDisplayProps) => {
	if (!user) return null;

	return (
		<div className="w-full px-4 py-6 sm:px-6">
			<div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-6 sm:space-y-8 border border-gray-200 dark:border-gray-800">
				{/* Header with Edit Button */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
						Profile Information
					</h1>
					<Button
						variant="outline"
						size="sm"
						className="w-full sm:w-auto text-sm cursor-pointer"
						onClick={onEdit}
					>
						Edit Profile
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					{profileFormInputAttributes.map((field) => (
						<div
							key={field.name}
							className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
						>
							<h3 className="text-sm text-gray-500 dark:text-gray-400">
								{field.label}
							</h3>
							<p className="text-base font-medium text-gray-900 dark:text-white mt-1 break-words">
								{user[field.name as keyof typeof user] ||
									"Not provided"}
							</p>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					{["Country", "State/Province", "City"].map(
						(label, index) => (
							<div
								key={index}
								className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
							>
								<h3 className="text-sm text-gray-500 dark:text-gray-400">
									{label}
								</h3>
								<p className="text-base font-medium text-gray-900 dark:text-white mt-1 break-words">
									{user?.location?.[label.toLowerCase()] ||
										"Not provided"}
								</p>
							</div>
						)
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					{[
						{ label: "LinkedIn Profile", value: user.linkedinURL },
						{ label: "GitHub Profile", value: user.githubURL },
					].map((field, index) => (
						<div
							key={index}
							className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
						>
							<h3 className="text-sm text-gray-500 dark:text-gray-400">
								{field.label}
							</h3>
							<p className="text-base font-medium text-blue-600 dark:text-blue-400 mt-1 break-all">
								{field.value || "Not provided"}
							</p>
						</div>
					))}
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
					<h3 className="text-sm text-gray-500 dark:text-gray-400">
						About You
					</h3>
					<p className="text-base font-medium text-gray-900 dark:text-white mt-2 whitespace-pre-line">
						{user.about || "Not provided"}
					</p>
				</div>
			</div>
		</div>
	);
};
