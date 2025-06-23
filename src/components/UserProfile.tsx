import { ChevronDown, ImageUp, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { verifyUser } from "@/lib/dal";


export default async function UserProfile() {
  const { user } = await verifyUser();
  return (
    <div>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg">
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <div>{user.email}</div>
            </div>
            <ChevronDown />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ImageUp />
              Upload Picture
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
