// File: components/extra-modules/ExtraModuleCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Edit2,
    Trash2,
    ExternalLink,
    Calendar,
    MapPin,
    Building,
} from "lucide-react";
import type {
    ExtraModuleData,
    ExtraModuleType,
    Language,
    Volunteering,
    Extracurricular,
    Interest,
    AwardHonor,
} from "@/types/extra-module.type";
import { formatDate } from "@/lib/extra-modules-utils";

interface ExtraModuleCardProps {
    item: ExtraModuleData;
    type: ExtraModuleType;
    onEdit: (item: ExtraModuleData) => void;
    onDelete: (id: string) => void;
}

export function ExtraModuleCard({
    item,
    type,
    onEdit,
    onDelete,
}: ExtraModuleCardProps) {
    const formatPeriod = (period: {
        startDate?: string;
        endDate?: string;
        isOngoing: boolean;
    }) => {
        if (!period.startDate) return null;
        const start = formatDate(period.startDate);
        const end = period.isOngoing
            ? "Present"
            : period.endDate
                ? formatDate(period.endDate)
                : "Present";
        return `${start} - ${end}`;
    };

    const renderLanguageCard = (language: Language) => (
        <>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{language.name}</h3>
                <Badge variant="secondary" className="ml-2">
                    {language.proficiency}
                </Badge>
            </div>
            {language.certification && (
                <p className="text-sm text-muted-foreground">
                    <strong>Certification:</strong> {language.certification}
                </p>
            )}
        </>
    );

    const renderVolunteeringCard = (volunteering: Volunteering) => (
        <>
            <div className="mb-3">
                <h3 className="font-semibold text-lg">{volunteering.role}</h3>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{volunteering.organization}</span>
                </div>
            </div>

            {volunteering.cause && (
                <p className="text-sm mb-2">
                    <strong>Cause:</strong> {volunteering.cause}
                </p>
            )}

            {volunteering.period && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatPeriod(volunteering.period)}</span>
                </div>
            )}

            {volunteering.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteering.location}</span>
                </div>
            )}

            {volunteering.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {volunteering.description}
                </p>
            )}

            {volunteering.website && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    asChild
                >
                    <a
                        href={volunteering.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="text-xs">Visit Website</span>
                    </a>
                </Button>
            )}
        </>
    );

    const renderExtracurricularCard = (extracurricular: Extracurricular) => (
        <>
            <div className="mb-3">
                <h3 className="font-semibold text-lg">
                    {extracurricular.title}
                </h3>
                {extracurricular.position && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {extracurricular.position}
                    </p>
                )}
            </div>

            {extracurricular.organization && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4" />
                    <span>{extracurricular.organization}</span>
                </div>
            )}

            {extracurricular.period && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatPeriod(extracurricular.period)}</span>
                </div>
            )}

            {extracurricular.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{extracurricular.location}</span>
                </div>
            )}

            {extracurricular.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {extracurricular.description}
                </p>
            )}
        </>
    );

    const renderInterestCard = (interest: Interest) => (
        <>
            <div className="mb-3">
                <h3 className="font-semibold text-lg">{interest.title}</h3>
                {interest.category && (
                    <Badge variant="outline" className="mt-1">
                        {interest.category}
                    </Badge>
                )}
            </div>

            {interest.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {interest.description}
                </p>
            )}
        </>
    );

    const renderAwardHonorCard = (award: AwardHonor) => (
        <>
            <div className="mb-3">
                <h3 className="font-semibold text-lg">{award.title}</h3>
                {award.issuer && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Issued by {award.issuer}
                    </p>
                )}
            </div>

            {award.dateReceived && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(award.dateReceived)}</span>
                </div>
            )}

            {award.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{award.location}</span>
                </div>
            )}

            {award.category && (
                <Badge variant="outline" className="mb-2">
                    {award.category}
                </Badge>
            )}

            {award.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {award.description}
                </p>
            )}

            {award.certificateLink && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    asChild
                >
                    <a
                        href={award.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="text-xs">View Certificate</span>
                    </a>
                </Button>
            )}
        </>
    );

    const renderCardContent = () => {
        switch (type) {
            case "language":
                return renderLanguageCard(item as Language);
            case "volunteering":
                return renderVolunteeringCard(item as Volunteering);
            case "extracurricular":
                return renderExtracurricularCard(item as Extracurricular);
            case "interest":
                return renderInterestCard(item as Interest);
            case "award-honor":
                return renderAwardHonorCard(item as AwardHonor);
            default:
                return null;
        }
    };

    return (
        <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item._id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">{renderCardContent()}</CardContent>
        </Card>
    );
}
