// components/certification/CertificationDeleteDialog.tsx
import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface CertificationDeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	certificationName: string;
	loading?: boolean;
}

export const CertificationDeleteDialog: React.FC<
	CertificationDeleteDialogProps
> = ({ isOpen, onClose, onConfirm, certificationName, loading = false }) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-600" />
						Delete Certification
					</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete{" "}
						<strong>"{certificationName}"</strong>? This action
						cannot be undone and will permanently remove this
						certification from your profile.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={loading}
						className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
					>
						{loading && (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						)}
						Delete Certification
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
