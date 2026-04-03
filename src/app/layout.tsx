import type { Metadata } from "next";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI in AMR Research — Scoping Review Dashboard",
  description: "Interactive dashboard exploring 252 studies on the application of artificial intelligence in antimicrobial resistance research.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
