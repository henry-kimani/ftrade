import { getAllowedUsers, isUserAdmin } from "@/db/queries";
import { verifyUser } from "@/lib/dal";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup,
  DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import UpdateRoleForm from "@/components/forms/UpdateRoleForm";

export default async function AllowedUsersTable() {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);
  const allowedUsers = await getAllowedUsers();

  return (
    <table className="table min-w-full rounded-t-md">
      <thead className="border-b text-left *:text-muted-foreground">
        <tr>
          <th className="@md/main:px-3 py-4 ">EMAIL</th>
          <th className="@md/main:px-3 py-4 ">ROLE</th>
          {isAdmin && <th className="@md/main:px-3 py-4"></th>}
        </tr>
      </thead>
      <tbody className="divide-y">
        {allowedUsers.map(({ id: userId, email, role }) => (
          <tr className="hover:bg-border/20" key={email}>
            <td className="text-ellipsis overflow-hidden @md/main:pl-4 pr-2 py-5">{email}</td>
            <td className="@md/main:pl-4 py-5">{role}</td>
            { isAdmin && <td className="sm/main:pl-4 pr-3 py-5">
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:bg-border/70">
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup className="min-w-40">
                    <DropdownMenuLabel>Update Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <UpdateRoleForm defaultValue={role} userId={userId}/>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>}
          </tr>
        ))}
      </tbody>
    </table>

  );
}
