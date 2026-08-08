// components/certification/CertificationModal.tsx
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CertificationForm } from "./CertificationForm";
import type {
	Certification,
	CertificationFormData,
} from "@/types/index";

interface CertificationModalProps {
	isOpen: boolean;
	onClose: () => void;
	certification?: Certification;
	onSubmit: (data: CertificationFormData) => void;
	loading?: boolean;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
	isOpen,
	onClose,
	certification,
	onSubmit,
	loading = false,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{certification
							? "Edit Certification"
							: "Add New Certification"}
					</DialogTitle>
				</DialogHeader>

				<CertificationForm
					certification={certification}
					onSubmit={onSubmit}
					onCancel={onClose}
					loading={loading}
				/>
			</DialogContent>
		</Dialog>
	);
};
