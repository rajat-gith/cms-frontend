"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LocationSelectProps } from "@/types/index";

export const LocationSelect = ({
	form,
	name,
	label,
	options,
	onValueChange,
	disabled = false,
	placeholder,
}: LocationSelectProps) => (
	<FormField
		control={form.control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<Select
					onValueChange={(value) => {
						field.onChange(value);
						onValueChange(value);
					}}
					value={field.value || ""}
					disabled={disabled}
				>
					<FormControl>
						<SelectTrigger className="w-full cursor-pointer">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
					</FormControl>
					<SelectContent className="cursor-pointer">
						{options.length > 0 ? (
							options.map((option: any) => (
								<SelectItem
									key={option.key}
									value={option.value}
									className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									{option.label}
								</SelectItem>
							))
						) : (
							<SelectItem
								value="__no_options__"
								disabled
								className="cursor-not-allowed"
							>
								No {label.toLowerCase()} available
							</SelectItem>
						)}
						<SelectItem
							value="others"
							className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
						>
							Other (specify)
						</SelectItem>
					</SelectContent>
				</Select>
				<FormMessage />
			</FormItem>
		)}
	/>
);
