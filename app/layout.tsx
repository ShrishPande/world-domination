import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import LogoutButton from "@/components/LogoutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Domination: Gemini's Gambit",
  description: "A game of global strategy powered by Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <AuthProvider>
          <GameProvider>
            <div className="min-h-screen flex flex-col items-center p-4">
              <div className="w-full max-w-7xl mx-auto flex-grow relative">
                <LogoutButton />
                {children}
              </div>
            </div>
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
