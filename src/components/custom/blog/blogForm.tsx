"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Eye, EyeOff } from "lucide-react";
import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { blogFormSchema, type BlogFormData } from "@/types/blog-form";
import type { Blog } from "@/types";

interface BlogFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: BlogFormData) => void;
	blog?: Blog | null;
	loading?: boolean;
}

export function BlogForm({
	isOpen,
	onClose,
	onSubmit,
	blog,
	loading = false,
}: BlogFormProps) {
	const [tagInput, setTagInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);

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

	useEffect(() => {
		if (isOpen) {
			const initialData = {
				title: blog?.title || "",
				content: blog?.content || "",
				tags: blog?.tags || [],
				isPublished: blog?.isPublished || false,
				publishedAt: formatDateTimeForInput(blog?.publishedAt),
			};

			setTags(initialData.tags);
			form.reset(initialData);
		} else {
			const emptyData = {
				title: "",
				content: "",
				tags: [],
				isPublished: false,
				publishedAt: "",
			};

			setTags([]);
			form.reset(emptyData);
		}
	}, [isOpen, blog, form]);

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

	const handleFormSubmit = (data: BlogFormData) => {
		const formattedData = {
			...data,
			publishedAt: data.publishedAt
				? new Date(data.publishedAt).toISOString()
				: undefined,
			tags: tags,
		};
		onSubmit(formattedData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{blog ? "Edit Blog Post" : "Create New Blog Post"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleFormSubmit)}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Blog Title *</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your blog title..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Blog Content *</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Write your blog content here..."
											className="min-h-[200px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-3">
							<FormLabel>Tags</FormLabel>
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
									size="sm"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{tags.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="text-sm"
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

						<div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
							<FormField
								control={form.control}
								name="isPublished"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel className="flex items-center gap-2">
												{field.value ? (
													<>
														<Eye className="h-4 w-4" />
														Publish this blog post
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
												When should this blog post be
												published?
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading
									? "Saving..."
									: blog
										? "Update"
										: "Create"}
								Blog
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
