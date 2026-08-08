"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, User, Eye, EyeOff, Image } from "lucide-react";
import { format } from "date-fns";
import type { Blog } from "@/types";

interface BlogCardProps {
	blog: Blog;
	onEdit: (blog: Blog) => void;
	onDelete: (id: string) => void;
}

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
	const formatDate = (dateString?: string) => {
		if (!dateString) return "Not published";
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return dateString;
			}
			return format(date, "MMM dd, yyyy");
		} catch {
			return dateString;
		}
	};

	const truncateContent = (content: string, maxLength: number = 150) => {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + "...";
	};

	return (
		<Card className="group hover:shadow-md transition-shadow duration-200">
			{blog.coverImage && (
				<div className="aspect-video w-full overflow-hidden rounded-t-lg">
					<img
						src={blog.coverImage}
						alt={blog.title}
						className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.style.display = "none";
						}}
					/>
				</div>
			)}

			<CardHeader className="pb-3 relative">
				{/* Add padding-right so text doesn't overlap with icons */}
				<div className="flex items-start justify-between gap-4 pr-16">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<Badge
								variant={
									blog.isPublished ? "default" : "secondary"
								}
								className="text-xs"
							>
								{blog.isPublished ? (
									<>
										<Eye className="h-3 w-3 mr-1" />
										Published
									</>
								) : (
									<>
										<EyeOff className="h-3 w-3 mr-1" />
										Draft
									</>
								)}
							</Badge>
						</div>

						<h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 break-words">
							{blog.title}
						</h3>

						<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2 break-words">
							<User className="h-4 w-4" />
							<span>By {blog.author.name}</span>
						</div>

						{blog.isPublished && blog.publishedAt && (
							<div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm break-words">
								<Calendar className="h-4 w-4" />
								<span>{formatDate(blog.publishedAt)}</span>
							</div>
						)}
					</div>
				</div>

				{/* Absolute positioned icons */}
				<div className="absolute top-3 right-3 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onEdit(blog)}
						className="h-8 w-8 p-0"
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onDelete(blog._id)}
						className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="space-y-3">
					<p className="text-sm text-gray-700 dark:text-gray-300 break-words line-clamp-3">
						{truncateContent(blog.content)}
					</p>

					{blog.tags && blog.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{blog.tags.slice(0, 4).map((tag, index) => (
								<Badge
									key={index}
									variant="outline"
									className="text-xs"
								>
									#{tag}
								</Badge>
							))}
							{blog.tags.length > 4 && (
								<Badge
									variant="outline"
									className="text-xs text-gray-500"
								>
									+{blog.tags.length - 4} more
								</Badge>
							)}
						</div>
					)}

					{!blog.coverImage && (
						<div className="flex items-center gap-2 text-gray-400 text-xs">
							<Image className="h-3 w-3" />
							<span>No cover image</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
