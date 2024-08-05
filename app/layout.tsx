import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PantryProvider } from "@/context/PantryContext";
import { CartProvider } from "@/context/CartContext";
import { AuthUserProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthUserProvider>
                    <PantryProvider>
                        <CartProvider>{children}</CartProvider>
                    </PantryProvider>
                </AuthUserProvider>
            </body>
        </html>
    );
}