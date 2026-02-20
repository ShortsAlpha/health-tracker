import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderTitle } from "@/components/header-title";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Health OS",
  description: "Track your health metrics and blood work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-14 sticky top-0 z-10 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <HeaderTitle />
            </header>
            <div className="flex-1 p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
