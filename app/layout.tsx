import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

import Footer from "@/app/components/Footer";
import packageJson from "@/package.json";

const inter = Inter({
    weight: ["400", "500", "600", "700", "900"],
    subsets: ["latin"]
});

const description = "Find & summarise anything on the web with AI";

export const metadata: Metadata = {
    title: `Collate AI · ${packageJson.version}`,
    description: description,
    icons: { icon: "/images/icon.png" },
    openGraph: {
        title: "Collate AI",
        description: description,
        url: "https://collate.harveycoombs.com",
        images: [{
            url: "https://collate.harveycoombs.com/images/splash.jpg",
            width: 1200,
            height: 630,
            alt: "Collate AI splash image"
        }],
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Collate AI",
        description: description
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/images/icon.png" />
                <link rel="canonical" href="https://collate.harveycoombs.com" />
            </head>
            <body className={`h-screen ${inter.className} bg-white text-slate-600`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}