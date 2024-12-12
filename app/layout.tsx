import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

import Footer from "./components/footer";

const inter = Inter({
    weight: ["400", "500", "600", "700", "900"],
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: `Collate · ${process.env.APP_VERSION}`,
    description: "Find & summarise anything on the web with AI",
    icons: {
        icon: "/images/icon.png"
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`h-screen ${inter.className} bg-white text-slate-600`}>
                {children}
                <Footer />
            </body>
        </html>
    );
}