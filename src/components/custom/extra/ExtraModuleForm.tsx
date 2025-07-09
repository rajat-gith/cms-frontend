// File: components/extra-modules/ExtraModuleForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type {
    ExtraModuleData,
    ExtraModuleType,
} from "@/types/extra-module.type";
import {
    getModuleConfig,
    proficiencyLevels,
    interestCategories,
    awardCategories,
} from "@/lib/extra-modules-config";

interface ExtraModuleFormProps {
    type: ExtraModuleType;
    item?: ExtraModuleData;
    onSubmit: (data: Partial<ExtraModuleData>) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function ExtraModuleForm({
    type,
    item,
    onSubmit,
    onCancel,
    loading,
}: ExtraModuleFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const config = getModuleConfig(type);

    useEffect(() => {
        if (item) {
            // Pre-populate form with existing data
            setFormData(item);
        } else {
            // Initialize with default values
            const defaultData: Record<string, any> = {};
            config.fields.forEach((field) => {
                if (field.name.includes(".")) {
                    const [parent, child] = field.name.split(".");
                    if (!defaultData[parent]) defaultData[parent] = {};
                    defaultData[parent][child] =
                        field.type === "checkbox" ? false : "";
                } else {
                    defaultData[field.name] =
                        field.type === "checkbox" ? false : "";
                }
            });
            setFormData(defaultData);
        }
    }, [item, config.fields]);

    const handleInputChange = (fieldName: string, value: any) => {
        if (fieldName.includes(".")) {
            const [parent, child] = fieldName.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [fieldName]: value,
            }));
        }
    };

    const getFieldValue = (fieldName: string) => {
        if (fieldName.includes(".")) {
            const [parent, child] = fieldName.split(".");
            return formData[parent]?.[child] || "";
        }
        return formData[fieldName] || "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clean up form data - remove empty strings and null values
        const cleanedData = Object.keys(formData).reduce((acc, key) => {
            const value = formData[key];
            if (value !== "" && value !== null && value !== undefined) {
                if (typeof value === "object" && !Array.isArray(value)) {
                    const cleanedObj = Object.keys(value).reduce(
                        (objAcc, objKey) => {
                            if (
                                value[objKey] !== "" &&
                                value[objKey] !== null &&
                                value[objKey] !== undefined
                            ) {
                                objAcc[objKey] = value[objKey];
                            }
                            return objAcc;
                        },
                        {} as any
                    );
                    if (Object.keys(cleanedObj).length > 0) {
                        acc[key] = cleanedObj;
                    }
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {} as any);

        await onSubmit(cleanedData);
    };

    const renderField = (field: any) => {
        const fieldValue = getFieldValue(field.name);

        switch (field.type) {
            case "text":
            case "url":
                return (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </Label>
                        <Input
                            id={field.name}
                            type={field.type}
                            value={fieldValue}
                            onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                            }
                            required={field.required}
                        />
                    </div>
                );

            case "date":
                return (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </Label>
                        <Input
                            id={field.name}
                            type="date"
                            value={fieldValue}
                            onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                            }
                            required={field.required}
                        />
                    </div>
                );

            case "textarea":
                return (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </Label>
                        <Textarea
                            id={field.name}
                            value={fieldValue}
                            onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                            }
                            required={field.required}
                            rows={3}
                        />
                    </div>
                );

            case "checkbox":
                return (
                    <div
                        key={field.name}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            id={field.name}
                            checked={fieldValue}
                            onCheckedChange={(checked) =>
                                handleInputChange(field.name, checked)
                            }
                        />
                        <Label htmlFor={field.name}>{field.label}</Label>
                    </div>
                );

            case "select":
                const getSelectOptions = () => {
                    if (field.options) return field.options;
                    if (field.name === "proficiency")
                        return proficiencyLevels.map((p) => p.value);
                    if (field.name === "category" && type === "interest")
                        return interestCategories;
                    if (field.name === "category" && type === "award-honor")
                        return awardCategories;
                    return [];
                };

                return (
                    <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </Label>
                        <Select
                            value={fieldValue}
                            onValueChange={(value) =>
                                handleInputChange(field.name, value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={`Select ${field.label.toLowerCase()}`}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {getSelectOptions().map((option: any) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {item ? `Edit ${config.title}` : `Add New ${config.title}`}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {config.fields.map(renderField)}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : item ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
