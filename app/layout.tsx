import "./globals.css";
import Topbar from "@/components/Topbar";
import type { ReactNode } from "react";

export const metadata = {
  title: "StageMatch",
  description: "Matches musicians to venues for paid gigs"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
