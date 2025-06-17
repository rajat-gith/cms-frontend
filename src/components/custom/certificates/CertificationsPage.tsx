"use client";

import React from "react";
import { CertificationList } from "./CertificationList";
import { CertificationModal } from "./CertificationModal";
import { CertificationDeleteDialog } from "./CertificationDeleteDialog";
import { useCertifications } from "@/hooks/useCertifications";

export const CertificationsPage: React.FC = () => {
	const {
		certifications,
		loading,
		isModalOpen,
		isDeleteDialogOpen,
		selectedCertification,
		certificationToDelete,
		handleAdd,
		handleEdit,
		handleDelete,
		handleSubmit,
		confirmDelete,
		closeModal,
		closeDeleteDialog,
	} = useCertifications();

	return (
		<div className="container mx-auto px-4 py-8">
			<CertificationList
				certifications={certifications}
				onAdd={handleAdd}
				onEdit={handleEdit}
				onDelete={handleDelete}
				loading={loading}
			/>

			<CertificationModal
				isOpen={isModalOpen}
				onClose={closeModal}
				certification={selectedCertification}
				onSubmit={handleSubmit}
				loading={loading}
			/>

			<CertificationDeleteDialog
				isOpen={isDeleteDialogOpen}
				onClose={closeDeleteDialog}
				onConfirm={confirmDelete}
				certificationName={certificationToDelete?.name || ""}
				loading={loading}
			/>
		</div>
	);
};
