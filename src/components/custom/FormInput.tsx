import {
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
	FormItem,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const FormInput = ({
	form,
	name,
	label,
	placeholder,
	disabled = false,
	type = "text",
}: any) => (
	<FormField
		control={form.control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					{type === "textarea" ? (
						<Textarea
							placeholder={placeholder}
							className="min-h-[120px]"
							{...field}
						/>
					) : (
						<Input
							placeholder={placeholder}
							disabled={disabled}
							{...field}
						/>
					)}
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);
