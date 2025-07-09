"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserModules } from "./useUserModules";
import type { Blog } from "@/types";

export function useBlogForm() {
	const router = useRouter();
	const { deleteModuleItem, updateModuleItem, loading } = useUserModules();

	const openCreateDialog = () => {
		router.push("/dashboard/blog/form");
	};

	const openEditDialog = (blog: Blog) => {
		router.push(`/dashboard/blog/form?id=${blog._id}`);
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
		loading,
		openCreateDialog,
		openEditDialog,
		handleDelete,
		handleTogglePublish,
	};
}
