import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
    title: "Axolot | Engineering Digital Intelligence",
    description: "Axolot Engineering Digital Intelligence",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={clsx(inter.variable, manrope.variable, "antialiased")} suppressHydrationWarning>
            <body className="font-sans selection:bg-white/20">
                {children}
            </body>
        </html>
    );
}
