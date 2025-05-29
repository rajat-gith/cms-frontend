"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { State, City } from "country-state-city";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { LocationSelect } from "./LocationSelect";
import { FormInput } from "../custom/FormInput";
import { profileSchema } from "@/utils/validations";
import { PROFILE_FORM_INITIAL_VALUES } from "@/utils/constants";
import { profileFormInputAttributes } from "@/utils/formInputAttributes";
import { ProfileEditModalProps, StateOption, CityOption } from "@/types/index";

export const ProfileEditModal = ({
	open,
	onOpenChange,
	user,
	onSave,
	countries,
}: ProfileEditModalProps) => {
	const [states, setStates] = useState<StateOption[]>([]);
	const [cities, setCities] = useState<CityOption[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [customInputs, setCustomInputs] = useState({
		state: false,
		city: false,
	});

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			...PROFILE_FORM_INITIAL_VALUES,
			...user,
			location: {
				country: user?.location?.country || "",
				state: user?.location?.state || "",
				city: user?.location?.city || "",
			},
		},
	});

	const { watch, setValue } = form;
	const locationWatch = watch("location");

	useEffect(() => {
		if (user && countries.length > 0 && user.location?.country) {
			const selectedCountry = countries.find(
				(c) => c.name === user.location.country
			);
			if (selectedCountry) {
				const countryStates = State.getStatesOfCountry(
					selectedCountry.isoCode
				);
				setStates(countryStates);

				if (user.location?.state) {
					const selectedState = countryStates.find(
						(s) => s.name === user.location.state
					);
					if (selectedState) {
						setCities(
							City.getCitiesOfState(
								selectedCountry.isoCode,
								selectedState.isoCode
							)
						);
					}
				}
			}
		}
	}, [user, countries]);

	const handleLocationChange = useCallback(
		(type: "country" | "state" | "city", value: string) => {
			if (value === "others") {
				setCustomInputs((prev) => ({ ...prev, [type]: true }));
				setValue(`location.${type}`, "");
				if (type !== "city") {
					if (type === "country") {
						setStates([]);
						setCities([]);
						setCustomInputs((prev) => ({
							...prev,
							state: false,
							city: false,
						}));
					} else {
						setCities([]);
						setCustomInputs((prev) => ({ ...prev, city: false }));
					}
				}
				return;
			}

			setCustomInputs((prev) => ({ ...prev, [type]: false }));
			setValue(`location.${type}`, value);

			if (type === "country") {
				const selectedCountry = countries.find((c) => c.name === value);
				if (selectedCountry) {
					setStates(
						State.getStatesOfCountry(selectedCountry.isoCode)
					);
				} else {
					setStates([]);
				}
				setCities([]);
				setValue("location.state", "");
				setValue("location.city", "");
			} else if (type === "state") {
				const selectedCountry = countries.find(
					(c) => c.name === locationWatch?.country
				);
				const selectedState = states.find((s) => s.name === value);
				if (selectedCountry && selectedState) {
					setCities(
						City.getCitiesOfState(
							selectedCountry.isoCode,
							selectedState.isoCode
						)
					);
				}
				setValue("location.city", "");
			}
		},
		[setValue, locationWatch?.country, countries, states]
	);

	const onSubmit = async (data: z.infer<typeof profileSchema>) => {
		setIsSubmitting(true);
		try {
			await onSave(data);
			onOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const countryOptions = countries.map((c) => ({
		key: c.isoCode,
		value: c.name,
		label: c.name,
		isoCode: c.isoCode,
	}));

	const stateOptions = states.map((s) => ({
		key: s.isoCode,
		value: s.name,
		label: s.name,
		isoCode: s.isoCode,
	}));

	const cityOptions = cities.map((c, i) => ({
		key: i,
		value: c.name,
		label: c.name,
	}));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="cursor-pointer">
						Edit Profile
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6 pt-4"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{profileFormInputAttributes.map((field) => (
								<FormInput
									key={field.name}
									form={form}
									{...field}
								/>
							))}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{[
								{
									type: "country",
									name: "location.country",
									label: "Country",
									placeholder: "Select country",
									options: countryOptions,
									disabled: false,
									isCustomInput: false,
								},
								{
									type: "state",
									name: "location.state",
									label: "State/Province",
									placeholder: customInputs.state
										? "Enter your state"
										: "Select state",
									options: stateOptions,
									disabled: !locationWatch?.country,
									isCustomInput: customInputs.state,
								},
								{
									type: "city",
									name: "location.city",
									label: "City",
									placeholder: customInputs.city
										? "Enter your city"
										: "Select city",
									options: cityOptions,
									disabled: !locationWatch?.state,
									isCustomInput: customInputs.city,
								},
							].map((field) =>
								field.isCustomInput ? (
									<FormInput
										key={field.name}
										form={form}
										name={field.name}
										label={field.label}
										placeholder={field.placeholder}
									/>
								) : (
									<LocationSelect
										key={field.name}
										form={form}
										name={field.name}
										label={field.label}
										placeholder={field.placeholder}
										options={field.options}
										disabled={field.disabled}
										onValueChange={(v: string) =>
											handleLocationChange(
												field.type as
													| "country"
													| "state"
													| "city",
												v
											)
										}
									/>
								)
							)}
						</div>

						<FormInput
							form={form}
							name="linkedinURL"
							label="LinkedIn Profile URL"
							placeholder="https://linkedin.com/in/username"
						/>
						<FormInput
							form={form}
							name="githubURL"
							label="GitHub Profile URL"
							placeholder="https://github.com/username"
						/>
						<FormInput
							form={form}
							name="about"
							label="About You"
							placeholder="Tell us about yourself..."
							type="textarea"
						/>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
