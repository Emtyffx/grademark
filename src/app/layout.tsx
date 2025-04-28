import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/context/AuthContext";
import { getCurrentSession } from "@/lib/auth";
import { serializeUser } from "@/lib/models/User";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grademark",
  description: "Mark your grades in modern style",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSession = await getCurrentSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider enableSystem defaultTheme="dark" attribute="class">
          <AuthProvider user={serializeUser(currentSession?.user)}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
