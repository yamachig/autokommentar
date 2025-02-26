import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AutoKommentar",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet"/>
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
