import type { Metadata, Viewport } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/custom/Navbar";
import { UserProvider } from "@/providers/UserProvider";

import "./globals.css";

import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "CMS",
    description:
        "Easily manage and publish content with a streamlined, intuitive CMS built with modern web technologies.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) throw new Error("Google Client ID is not defined");

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID!}>
            <html lang="en" className={openSans.className}>
                <body className="h-dvh flex flex-col overflow-hidden">
                    <Navbar />
                    <UserProvider>
                        <div className="flex-1 overflow-auto">
                            <main className="min-h-full p-4">{children}</main>
                        </div>
                    </UserProvider>
                    <Toaster richColors />
                </body>
            </html>
        </GoogleOAuthProvider>
    );
}