import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import packageJson from "@/package.json";
import { authenticate } from "@/lib/jwt";
import UserProvider from "@/app/context/UserContext";

const geistMono = Geist_Mono({
    weight: ["300", "400", "500", "600", "700", "800"],
    subsets: ["latin"]
});

const description = "Find & summarise anything on the web with AI";

export const metadata: Metadata = {
    title: `Dark Tensor · ${packageJson.version}`,
    description: description,
    icons: { icon: "/images/icon.png" },
    openGraph: {
        title: "Dark Tensor",
        description: description,
        url: "https://darktensor.ai",
        images: [{
            url: "https://darktensor.ai/images/splash.jpg",
            width: 1200,
            height: 630,
            alt: "Dark Tensor splash image"
        }],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Dark Tensor",
        description: description
    }
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieJar = await cookies();
    const token = cookieJar.get("token")?.value ?? "";
    const user = await authenticate(token);
    
    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/images/icon.png" />
                <link rel="canonical" href="https://darktensor.ai" />
            </head>

            <body className={`h-screen ${geistMono.className} bg-white text-gray-600`}>
                <UserProvider user={user}>
                    <Header />
                    {children}
                    <Footer />
                </UserProvider>
            </body>
        </html>
    );
}