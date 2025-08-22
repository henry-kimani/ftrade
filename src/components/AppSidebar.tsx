import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { AlignHorizontalDistributeCenter, AppWindowIcon, CircleDollarSign, Goal, RefreshCcw, Settings } from "lucide-react";
import { SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";
import UserEmailProfile from "@/components/user/UserSidebarEmail";
import { Suspense } from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: AppWindowIcon
  },
  {
    title: "Trades",
    url: "/trades",
    icon: Goal
  },
  {
    title: "Trading View",
    url: "/tradingview",
    icon: AlignHorizontalDistributeCenter
  },
  {
    title: "Sync Data",
    url: "/sync-data",
    icon: RefreshCcw
  }
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/"}>
                <CircleDollarSign />
                <h1 className="text-lg font-bold">FTrade</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content*/}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Essentials</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mb-2">
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Suspense fallback="Loading profile ...">
            <UserEmailProfile />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
