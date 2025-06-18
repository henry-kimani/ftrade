import { getAllowedUsers } from "@/db/queries";


export default async function AllowedUsersTable() {

  const allowedUsers = await getAllowedUsers();

  return (
    <table className="table min-w-full rounded-t-md">
      <thead className="bg-sidebar text-left *:text-muted-foreground">
        <tr className="">
          <th className="px-3 py-4">Email</th>
          <th className="px-3 py-4">Role</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {allowedUsers.map(({ email, role }) => (
          <tr className="hover:bg-border/20 cursor-pointer" key={email}>
            <td className="pl-4 pr-3 py-5">{email}</td>
            <td className="pl-4 pr-3 py-5">{role}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
