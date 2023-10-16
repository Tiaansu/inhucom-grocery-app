import '@/styles/globals.css';
import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

export const metadata: Metadata = {
    title: 'Tindahan ni Aling Nena',
    description: 'A simple web app for Tindahan ni Aling Nena',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    )
}
