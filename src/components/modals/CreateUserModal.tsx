import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import CreateUserForm from "@/components/forms/CreateUserForm";
import { isUserAdmin } from "@/db/queries";
import { verifyUser } from "@/lib/dal";

export default async function CreateUserModalForm() {
  const data = await verifyUser();
  const isAdmin = await isUserAdmin(data.user.id);

  if (isAdmin) {
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
