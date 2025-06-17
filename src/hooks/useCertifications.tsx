// hooks/useCertifications.ts
import { useState, useEffect, useCallback } from "react";
import { useUserModules } from "@/hooks/useUserModules";
import { toast } from "sonner";
import type {
	Certification,
	CertificationFormData,
} from "@/types/index";
import { useUserModuleStore } from "@/store/user.store";

export const useCertifications = () => {
	const {
		fetchModule,
		createModuleItem,
		updateModuleItem,
		deleteModuleItem,
		loading,
		error,
	} = useUserModules();

	const { modules } = useUserModuleStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCertification, setSelectedCertification] = useState<
		Certification | undefined
	>();
	const [certificationToDelete, setCertificationToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// Get certifications from store
	const certifications = modules?.certification || [];

	// Fetch certifications on mount
	useEffect(() => {
		loadCertifications();
	}, []);

	const loadCertifications = useCallback(async () => {
		try {
			await fetchModule("certification"); // Singular to match your backend route
		} catch (error) {
			console.error("Failed to load certifications:", error);
			toast.error("Failed to load certifications");
		}
	}, [fetchModule]);

	const handleAdd = useCallback(() => {
		setSelectedCertification(undefined);
		setIsModalOpen(true);
	}, []);

	const handleEdit = useCallback((certification: Certification) => {
		setSelectedCertification(certification);
		setIsModalOpen(true);
	}, []);

	const handleDelete = useCallback(
		(id: string) => {
			const certification = certifications.find(
				(cert) => cert._id === id
			);
			if (certification) {
				setCertificationToDelete({ id, name: certification.name });
				setIsDeleteDialogOpen(true);
			}
		},
		[certifications]
	);

	const handleSubmit = useCallback(
		async (data: CertificationFormData) => {
			try {
				if (selectedCertification) {
					// Update existing certification
					await updateModuleItem(
						"certification",
						selectedCertification._id,
						data
					);
					toast.success("Certification updated successfully");
				} else {
					// Create new certification
					await createModuleItem("certification", data);
					toast.success("Certification added successfully");
				}

				setIsModalOpen(false);
				setSelectedCertification(undefined);
				await loadCertifications();
			} catch (error) {
				console.error("Failed to save certification:", error);
				toast.error(
					selectedCertification
						? "Failed to update certification"
						: "Failed to add certification"
				);
				throw error;
			}
		},
		[
			selectedCertification,
			updateModuleItem,
			createModuleItem,
			loadCertifications,
		]
	);

	const confirmDelete = useCallback(async () => {
		if (!certificationToDelete) return;

		try {
			await deleteModuleItem("certification", certificationToDelete.id);
			toast.success("Certification deleted successfully");
			setIsDeleteDialogOpen(false);
			setCertificationToDelete(null);
			await loadCertifications();
		} catch (error) {
			console.error("Failed to delete certification:", error);
			toast.error("Failed to delete certification");
		}
	}, [certificationToDelete, deleteModuleItem, loadCertifications]);

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		setSelectedCertification(undefined);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		setIsDeleteDialogOpen(false);
		setCertificationToDelete(null);
	}, []);

	return {
		// Data
		certifications,
		loading,
		error,

		// Modal states
		isModalOpen,
		isDeleteDialogOpen,
		selectedCertification,
		certificationToDelete,

		// Actions
		handleAdd,
		handleEdit,
		handleDelete,
		handleSubmit,
		confirmDelete,
		closeModal,
		closeDeleteDialog,
		loadCertifications,
	};
};
