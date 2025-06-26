// File: components/extra-modules/ExtraModuleList.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { ExtraModuleCard } from "./ExtraModuleCard";
import { ExtraModuleForm } from "./ExtraModuleForm";
import { useUserModules } from "@/hooks/useUserModules";
import { useUserModuleStore } from "@/store/user.store";
import type {
    ExtraModuleData,
    ExtraModuleType,
} from "@/types/extra-module.type";
import { getModuleConfig } from "@/lib/extra-modules-config";
import { toast } from "sonner";

interface ExtraModuleListProps {
    type: ExtraModuleType;
}

export function ExtraModuleList({ type }: ExtraModuleListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<ExtraModuleData | null>(
        null
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
        null
    );

    const config = getModuleConfig(type);
    const {
        fetchModule,
        createModuleItem,
        updateModuleItem,
        deleteModuleItem,
        loading,
    } = useUserModules();
    const moduleData = useUserModuleStore((state) => state.modules[type]);
    useEffect(() => {
        fetchModule(type);
    }, [fetchModule, type]);

    const filteredData = moduleData.filter((item: any) => {
        const matchesSearch = Object.values(item).some((value: any) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesCategory =
            filterCategory === "all" ||
            (item.category &&
                item.category.toLowerCase() === filterCategory.toLowerCase()) ||
            (item.proficiency &&
                item.proficiency.toLowerCase() ===
                    filterCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const handleCreate = async (data: Partial<ExtraModuleData>) => {
        try {
            await createModuleItem(type, data);
            setShowForm(false);
            toast.success(`${config.title} created successfully`);
        } catch (error) {
            toast.error(`Failed to create ${config.title}`);
        }
    };

    const handleUpdate = async (data: Partial<ExtraModuleData>) => {
        if (!editingItem) return;

        try {
            await updateModuleItem(type, editingItem._id, data);
            setEditingItem(null);
            toast.success(`${config.title} updated successfully`);
        } catch (error) {
            toast.error(`Failed to update ${config.title}`);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteModuleItem(type, id);
            setShowDeleteConfirm(null);
            toast.success(`${config.title} deleted successfully`);
        } catch (error) {
            toast.error(`Failed to delete ${config.title}`);
        }
    };

    const handleEdit = (item: ExtraModuleData) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const getUniqueCategories = () => {
        const categories = new Set<string>();
        moduleData.forEach((item: any) => {
            if (item.category) categories.add(item.category);
            if (item.proficiency) categories.add(item.proficiency);
        });
        return Array.from(categories);
    };

    if (showForm) {
        return (
            <ExtraModuleForm
                type={type}
                item={editingItem || undefined}
                onSubmit={editingItem ? handleUpdate : handleCreate}
                onCancel={handleCancelForm}
                loading={loading}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{config.title}</h1>
                    <p className="text-muted-foreground">
                        {config.description}
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add {config.title}
                </Button>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={filterCategory}
                            onValueChange={setFilterCategory}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                {getUniqueCategories().map((category) => (
                                    <SelectItem
                                        key={category}
                                        value={category.toLowerCase()}
                                    >
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        {filteredData.length}{" "}
                        {filteredData.length === 1 ? "item" : "items"}
                    </Badge>
                    {searchTerm && (
                        <Badge variant="outline">
                            Searching: "{searchTerm}"
                        </Badge>
                    )}
                    {filterCategory !== "all" && (
                        <Badge variant="outline">
                            Category: {filterCategory}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                    <div className="h-3 bg-muted rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredData.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <config.icon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No {config.title} Found
                        </h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {searchTerm || filterCategory !== "all"
                                ? "No items match your current filters. Try adjusting your search or filters."
                                : `You haven't added any ${config.title.toLowerCase()} yet.`}
                        </p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Your First {config.title}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-4"
                    }
                >
                    {filteredData.map((item) => (
                        <ExtraModuleCard
                            key={item._id}
                            item={item}
                            type={type}
                            onEdit={(editItem) => handleEdit(editItem)}
                            onDelete={(id) => setShowDeleteConfirm(id)}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Confirm Deletion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Are you sure you want to delete this item? This
                                action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        handleDelete(showDeleteConfirm)
                                    }
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
