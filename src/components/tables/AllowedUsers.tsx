import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import CreateUserModal from "@/components/CreateUserModal";
import { Suspense } from "react";
import AllowedUsersTable from "./AllowedUsersTable";


export default function AllowedUsers() {
  return (
    <Card className="shadow-none bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-lg">Allowed Users</CardTitle>
        <CardDescription className="text-md">
          The list of the only allowed users and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback="Loading...">
          <AllowedUsersTable />
        </Suspense>
        <div className="grid">
          <Suspense fallback="Loading...">
            <CreateUserModal />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}
