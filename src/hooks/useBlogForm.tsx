"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserModules } from "./useUserModules";
import type { Blog } from "@/types";
import type { BlogFormData } from "@/types/blog-form";

export function useBlogForm() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
	const { createModuleItem, updateModuleItem, deleteModuleItem, loading } =
		useUserModules();

	const openCreateDialog = () => {
		setEditingBlog(null);
		setIsDialogOpen(true);
	};

	const openEditDialog = (blog: Blog) => {
		setEditingBlog(blog);
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingBlog(null);
	};

	const handleSubmit = async (data: BlogFormData) => {
		try {
			console.log("here")
			if (editingBlog) {
				await updateModuleItem("blogs", editingBlog._id, data);
				toast.success("Blog post updated successfully!");
			} else {
				await createModuleItem("blogs", data);
				toast.success("Blog post created successfully!");
			}
			closeDialog();
		} catch (error) {
			console.error("Blog form error:", error);
			toast.error(
				editingBlog
					? "Failed to update blog post"
					: "Failed to create blog post"
			);
		}
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this blog post?")) {
			try {
				await deleteModuleItem("blogs", id);
				toast.success("Blog post deleted successfully!");
			} catch (error) {
				toast.error("Failed to delete blog post");
			}
		}
	};

	const handleTogglePublish = async (blog: Blog) => {
		try {
			const updatedData = {
				...blog,
				isPublished: !blog.isPublished,
				publishedAt: !blog.isPublished
					? new Date().toISOString()
					: blog.publishedAt,
			};

			await updateModuleItem("blogs", blog._id, updatedData);
			toast.success(
				!blog.isPublished
					? "Blog post published successfully!"
					: "Blog post unpublished successfully!"
			);
		} catch (error) {
			toast.error("Failed to update blog status");
		}
	};

	return {
		isDialogOpen,
		editingBlog,
		loading,
		openCreateDialog,
		openEditDialog,
		closeDialog,
		handleSubmit,
		handleDelete,
		handleTogglePublish,
	};
}
