// components/certification/CertificationCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Calendar,
	ExternalLink,
	MoreVertical,
	Award,
	Building2,
	AlertTriangle,
	Edit,
	Trash2,
} from "lucide-react";
import { format, isValid } from "date-fns";
import type { CertificationCardProps } from "@/types/index";

export const CertificationCard: React.FC<CertificationCardProps> = ({
	certification,
	onEdit,
	onDelete,
}) => {
	const isExpired =
		certification.isExpired ||
		(certification.expirationDate &&
			new Date(certification.expirationDate) < new Date());

	const formatDate = (dateString?: string | null) => {
		if (!dateString) return "N/A";

		const parsedDate = new Date(dateString);
		if (!isValid(parsedDate)) return "N/A";

		return format(parsedDate, "MMM yyyy");
	};

	return (
		<Card
			className={`transition-all duration-200 hover:shadow-md ${
				isExpired
					? "border-red-200 bg-red-50/30"
					: "border-gray-200 hover:border-gray-300"
			}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-start space-x-3">
						<div
							className={`p-2 rounded-lg ${
								isExpired
									? "bg-red-100 text-red-600"
									: "bg-blue-100 text-blue-600"
							}`}
						>
							<Award className="h-5 w-5" />
						</div>
						<div className="flex-1 min-w-0">
							<CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
								{certification.name}
							</CardTitle>
							<div className="flex items-center mt-1 text-sm text-gray-600">
								<Building2 className="h-4 w-4 mr-1" />
								<span className="truncate">
									{certification.issuingOrganization}
								</span>
							</div>
						</div>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => onEdit(certification)}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDelete(certification._id)}
								className="text-red-600 focus:text-red-600"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="space-y-3">
					{/* Status and Dates */}
					<div className="flex flex-wrap items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
							<div className="flex items-center">
								<Calendar className="h-4 w-4 mr-1" />
								<span>
									Issued {formatDate(certification.issueDate)}
								</span>
							</div>
							{certification.expirationDate && (
								<div className="flex items-center">
									<span>•</span>
									<span className="ml-1">
										Expires{" "}
										{formatDate(
											certification.expirationDate
										)}
									</span>
								</div>
							)}
						</div>

						{isExpired && (
							<Badge
								variant="destructive"
								className="flex items-center text-xs"
							>
								<AlertTriangle className="h-3 w-3 mr-1" />
								Expired
							</Badge>
						)}
					</div>

					{/* Category */}
					{certification.category && (
						<div>
							<Badge variant="secondary" className="text-xs">
								{certification.category}
							</Badge>
						</div>
					)}

					{/* Skills */}
					{certification.skills.length > 0 && (
						<div>
							<div className="flex flex-wrap gap-1">
								{certification.skills
									.slice(0, 5)
									.map((skill, index) => (
										<Badge
											key={index}
											variant="outline"
											className="text-xs"
										>
											{skill}
										</Badge>
									))}
								{certification.skills.length > 5 && (
									<Badge
										variant="outline"
										className="text-xs"
									>
										+{certification.skills.length - 5} more
									</Badge>
								)}
							</div>
						</div>
					)}

					{/* Credential Info */}
					<div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
						{certification.credentialId && (
							<div className="text-xs text-gray-500 break-all">
								ID: {certification.credentialId}
							</div>
						)}

						{certification.credentialURL && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 text-xs text-blue-600 hover:text-blue-700"
								onClick={() =>
									window.open(
										certification.credentialURL,
										"_blank"
									)
								}
							>
								<ExternalLink className="h-3 w-3 mr-1" />
								View Credential
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
