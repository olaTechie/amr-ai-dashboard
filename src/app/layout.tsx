import type { Metadata } from "next";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI in AMR Research — Scoping Review Dashboard",
  description: "Interactive evidence dashboard for 346 validated studies on artificial intelligence in antimicrobial resistance research.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <main className="min-h-screen min-w-0 flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
