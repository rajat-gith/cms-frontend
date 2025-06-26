// File: lib/utils.ts (add these functions to your existing utils file)

export function formatDate(dateString: string | undefined): string {
    if (!dateString) return "";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        return dateString;
    }
}

export function formatDateRange(
    startDate?: string,
    endDate?: string,
    isOngoing?: boolean
): string {
    if (!startDate) return "";

    const start = formatDate(startDate);

    if (isOngoing) {
        return `${start} - Present`;
    }

    if (endDate) {
        const end = formatDate(endDate);
        return `${start} - ${end}`;
    }

    return start;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
}

export function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

// Validation helpers
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Date helpers
export function isDateInFuture(dateString: string): boolean {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
}

export function calculateDuration(
    startDate: string,
    endDate?: string,
    isOngoing?: boolean
): string {
    const start = new Date(startDate);
    const end = isOngoing
        ? new Date()
        : endDate
          ? new Date(endDate)
          : new Date();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months === 1 ? "" : "s"}`;
    } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.floor((diffDays % 365) / 30);

        if (remainingMonths === 0) {
            return `${years} year${years === 1 ? "" : "s"}`;
        }

        return `${years} year${years === 1 ? "" : "s"} ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
    }
}
