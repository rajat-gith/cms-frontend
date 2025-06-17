"use client";

import { useEffect, useState } from "react";
import { Plus, BookOpen, Filter, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BlogCard } from "@/components/custom/blog/blogCard";
import { BlogForm } from "@/components/custom/blog/blogForm";
import { useUserModuleStore } from "@/store/user.store";
import { useUserModules } from "@/hooks/useUserModules";
import { useBlogForm } from "@/hooks/useBlogForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { Blog } from "@/types";

export default function BlogsPage() {
	const { modules } = useUserModuleStore();
	const { fetchModule, loading } = useUserModules();
	const {
		isDialogOpen,
		editingBlog,
		loading: formLoading,
		openCreateDialog,
		openEditDialog,
		closeDialog,
		handleSubmit,
		handleDelete,
	} = useBlogForm();

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "published" | "draft"
	>("all");

	useEffect(() => {
		fetchModule("blogs");
	}, [fetchModule]);

	const blogs = modules.blogs || [];

	const filteredBlogs = blogs.filter((blog: Blog) => {
		const matchesSearch =
			blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			blog.author.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			blog.tags?.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesStatus =
			statusFilter === "all" ||
			(statusFilter === "published" && blog.isPublished) ||
			(statusFilter === "draft" && !blog.isPublished);

		return matchesSearch && matchesStatus;
	});

	const sortedBlogs = filteredBlogs.sort((a: Blog, b: Blog) => {
		if (a.isPublished && !b.isPublished) return -1;
		if (!a.isPublished && b.isPublished) return 1;

		const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
		const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

		return dateB - dateA;
	});

	const publishedCount = blogs.filter(
		(blog: Blog) => blog.isPublished
	).length;
	const draftCount = blogs.filter((blog: Blog) => !blog.isPublished).length;

	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<div>
						<Skeleton className="h-8 w-32 mb-2" />
						<Skeleton className="h-4 w-64" />
					</div>
					<Skeleton className="h-10 w-36" />
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card key={i}>
							<div className="aspect-video">
								<Skeleton className="h-full w-full rounded-t-lg" />
							</div>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-6 w-full" />
										<Skeleton className="h-4 w-24" />
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-20" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 sm:p-6 max-w-7xl">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
						<BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
						Blog Posts
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage your blog posts and articles
					</p>
					<div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
						<span className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{publishedCount} Published
						</span>
						<span className="flex items-center gap-1">
							<EyeOff className="h-4 w-4" />
							{draftCount} Drafts
						</span>
					</div>
				</div>
				<Button onClick={openCreateDialog} className="w-full sm:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Create Blog Post
				</Button>
			</div>

			{/* Filters */}
			{blogs.length > 0 && (
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search blogs by title, content, author, or tags..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select
						value={statusFilter}
						onValueChange={(value: "all" | "published" | "draft") =>
							setStatusFilter(value)
						}
					>
						<SelectTrigger className="w-full sm:w-[180px]">
							<Filter className="h-4 w-4 mr-2" />
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Posts</SelectItem>
							<SelectItem value="published">Published</SelectItem>
							<SelectItem value="draft">Drafts</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Content */}
			{blogs.length === 0 ? (
				<Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							No blog posts yet
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
							Start sharing your thoughts and ideas by creating
							your first blog post. You can save drafts and
							publish them when you're ready.
						</p>
						<Button onClick={openCreateDialog}>
							<Plus className="h-4 w-4 mr-2" />
							Create Your First Blog Post
						</Button>
					</CardContent>
				</Card>
			) : filteredBlogs.length === 0 ? (
				<Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<Search className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							No matching posts found
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
							No blog posts match your current search criteria.
							Try adjusting your search terms or filters.
						</p>
						<div className="flex flex-col sm:flex-row gap-2">
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setStatusFilter("all");
								}}
							>
								Clear Filters
							</Button>
							<Button onClick={openCreateDialog}>
								<Plus className="h-4 w-4 mr-2" />
								Create New Post
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{sortedBlogs.map((blog: Blog) => (
						<BlogCard
							key={blog._id}
							blog={blog}
							onEdit={() => openEditDialog(blog)}
							onDelete={() => handleDelete(blog._id)}
						/>
					))}
				</div>
			)}

			{/* Blog Form Dialog */}
			<BlogForm
				isOpen={isDialogOpen}
				onClose={closeDialog}
				onSubmit={handleSubmit}
				blog={editingBlog}
				loading={formLoading}
			/>
		</div>
	);
}
