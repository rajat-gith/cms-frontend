"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Plus, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import * as React from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogFormSchema, type BlogFormData } from "@/types/blog-form";
import type { Blog } from "@/types";
import { useUserModules } from "@/hooks/useUserModules";
import { useUserModuleStore } from "@/store/user.store";
import { toast } from "sonner";
import Tiptap from "@/components/custom/blog/TipTap";

// Loading component for suspense fallback
function BlogFormSkeleton() {
	return (
		<div className="container mx-auto p-4 sm:p-6 max-w-4xl">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					<div>
						<div className="w-48 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
						<div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					</div>
				</div>
			</div>
			<Card>
				<CardHeader>
					<div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				</CardHeader>
				<CardContent>
					<div className="space-y-8">
						<div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						<div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						<div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Main form component that uses useSearchParams
function BlogFormContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const blogId = searchParams.get("id");
	const isEdit = Boolean(blogId);

	const { modules } = useUserModuleStore();
	const { createModuleItem, updateModuleItem, loading } = useUserModules();

	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [blog, setBlog] = useState<Blog | null>(null);

	const formatDateTimeForInput = (dateString?: string): string => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			const offset = date.getTimezoneOffset();
			const localDate = new Date(date.getTime() - offset * 60 * 1000);
			return localDate.toISOString().slice(0, 16);
		} catch {
			return "";
		}
	};

	const form = useForm<BlogFormData>({
		resolver: zodResolver(blogFormSchema),
		defaultValues: {
			title: "",
			content: "",
			tags: [],
			isPublished: false,
			publishedAt: "",
		},
	});

	// Load blog data for editing
	useEffect(() => {
		if (isEdit && blogId && modules.blogs) {
			const foundBlog = modules.blogs.find((b: Blog) => b._id === blogId);
			if (foundBlog) {
				setBlog(foundBlog);
				const initialData = {
					title: foundBlog.title || "",
					content: foundBlog.content || "",
					tags: foundBlog.tags || [],
					isPublished: foundBlog.isPublished || false,
					publishedAt: formatDateTimeForInput(foundBlog.publishedAt),
				};
				setTags(initialData.tags);
				form.reset(initialData);
			}
		}
	}, [isEdit, blogId, modules.blogs, form]);

	const { watch, setValue } = form;
	const isPublished = watch("isPublished");

	useEffect(() => {
		if (isPublished && !watch("publishedAt")) {
			const now = new Date();
			const offset = now.getTimezoneOffset();
			const localDate = new Date(now.getTime() - offset * 60 * 1000);
			setValue("publishedAt", localDate.toISOString().slice(0, 16));
		}
	}, [isPublished, setValue, watch]);

	const handleAddTag = () => {
		const trimmedTag = tagInput.trim().toLowerCase();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			const newTags = [...tags, trimmedTag];
			setTags(newTags);
			setValue("tags", newTags);
			setTagInput("");
		}
	};

	const handleRemoveTag = (tag: string) => {
		const newTags = tags.filter((t) => t !== tag);
		setTags(newTags);
		setValue("tags", newTags);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	const handleFormSubmit = async (data: BlogFormData) => {
		try {
			const formattedData = {
				...data,
				publishedAt: data.publishedAt
					? new Date(data.publishedAt).toISOString()
					: undefined,
				tags: tags,
			};

			if (isEdit && blogId) {
				await updateModuleItem("blogs", blogId, formattedData);
				toast.success("Blog post updated successfully!");
			} else {
				await createModuleItem("blogs", formattedData);
				toast.success("Blog post created successfully!");
			}
			router.push("/dashboard/blog");
		} catch (error) {
			console.error("Blog form error:", error);
			toast.error(
				isEdit
					? "Failed to update blog post"
					: "Failed to create blog post"
			);
		}
	};

	const handleSaveDraft = async () => {
		const currentData = form.getValues();
		const formattedData = {
			...currentData,
			isPublished: false,
			publishedAt: undefined,
			tags: tags,
		};

		try {
			if (isEdit && blogId) {
				await updateModuleItem("blogs", blogId, formattedData);
				toast.success("Draft saved successfully!");
			} else {
				await createModuleItem("blogs", formattedData);
				toast.success("Draft created successfully!");
				router.push("/dashboard/blog");
			}
		} catch (error) {
			console.error("Save draft error:", error);
			toast.error("Failed to save draft");
		}
	};

	return (
		<div className="container mx-auto p-4 sm:p-6 max-w-4xl">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/dashboard/blog")}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Blogs
					</Button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
							{isEdit ? "Edit Blog Post" : "Create New Blog Post"}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-1">
							{isEdit
								? "Update your blog post"
								: "Share your thoughts and ideas"}
						</p>
					</div>
				</div>
			</div>

			{/* Form */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{isEdit ? "Edit Post" : "New Post"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleFormSubmit)}
							className="space-y-8"
						>
							{/* Title */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg">
											Blog Title *
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your blog title..."
												className="text-lg py-3"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg">
											Blog Content *
										</FormLabel>
										<FormControl>
											<Tiptap
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormDescription>
											Use formatting tools and add rich
											content using the editor.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Tags */}
							<div className="space-y-4">
								<FormLabel className="text-lg">Tags</FormLabel>
								<div className="flex gap-2">
									<Input
										value={tagInput}
										onChange={(e) =>
											setTagInput(e.target.value)
										}
										onKeyPress={handleKeyPress}
										placeholder="Add tags (e.g., react, javascript)"
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={handleAddTag}
										variant="outline"
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Tag
									</Button>
								</div>

								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="text-sm px-3 py-1"
											>
												#{tag}
												<button
													type="button"
													onClick={() =>
														handleRemoveTag(tag)
													}
													className="ml-2 hover:text-red-600"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								)}
							</div>

							{/* Publishing Options */}
							<Card className="bg-gray-50 dark:bg-gray-900">
								<CardHeader>
									<CardTitle className="text-lg">
										Publishing Options
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="isPublished"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel className="flex items-center gap-2 text-base">
														{field.value ? (
															<>
																<Eye className="h-4 w-4" />
																Publish this
																blog post
															</>
														) : (
															<>
																<EyeOff className="h-4 w-4" />
																Save as draft
															</>
														)}
													</FormLabel>
													<FormDescription>
														{field.value
															? "This blog post will be visible to others"
															: "This blog post will be saved as a draft"}
													</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									{isPublished && (
										<FormField
											control={form.control}
											name="publishedAt"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Published Date & Time *
													</FormLabel>
													<FormControl>
														<Input
															type="datetime-local"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														When should this blog
														post be published?
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</CardContent>
							</Card>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										router.push("/dashboard/blog")
									}
								>
									Cancel
								</Button>

								<div className="flex gap-3">
									<Button
										type="button"
										variant="outline"
										onClick={handleSaveDraft}
										disabled={loading}
									>
										<Save className="h-4 w-4 mr-2" />
										Save Draft
									</Button>
									<Button
										type="submit"
										disabled={loading}
										className="bg-blue-600 hover:bg-blue-700"
									>
										{loading
											? "Saving..."
											: isEdit
												? "Update"
												: "Create"}{" "}
										Blog
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

// Main component that wraps the form content in Suspense
export default function BlogFormPage() {
	return (
		<Suspense fallback={<BlogFormSkeleton />}>
			<BlogFormContent />
		</Suspense>
	);
}
