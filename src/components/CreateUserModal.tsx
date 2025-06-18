import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "./ui/dialog";
import CreateUserForm from "./CreateUserForm";
import { getUserRole } from "@/db/queries";
import { verifyUser } from "@/lib/dal";

export default async function CreateUserModalForm() {
  const data = await verifyUser();
  const userRole = await getUserRole(data.user.id);

  if (userRole === "admin") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Add a new user in the allowed list. Their role determines what they can see on the site
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm />
        </DialogContent>
      </Dialog>

  );
  } else return null;
}
