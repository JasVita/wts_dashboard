import { NarrowSidebar } from "@/components/Navigation/NarrowSideBar";
import "./globals.css";

export const metadata = {
  title: "Turoid Dashboard nextjs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-full bg-gray-100" suppressHydrationWarning={true}>
        <NarrowSidebar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
