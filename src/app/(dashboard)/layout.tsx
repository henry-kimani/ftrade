import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { cookies } from "next/headers";
import SiteHeader from "@/components/SiteHeader";
import ThemeProvider from "@/components/ThemeProvider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persist sidebar open state across pages
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div className="@container/main flex flex-col w-full">
          <SiteHeader />
          <div className="">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
