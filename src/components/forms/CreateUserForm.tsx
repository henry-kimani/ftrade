'use client';

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import { roles } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { State } from "@/lib/schemas";
import { createUser } from "@/lib/actions/auth";

export default function CreateUserForm() {
  const initialState: State = { errors: {}, message: null };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      <Input name="email" type="email" placeholder="Email" className=""/>
      {state.errors?.email && <p className="text-red-400 mt-2">{state.errors.email}</p>}
      <Select name="role">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.enumValues.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {state.errors?.role && <p className="text-red-400 mt-2">{state.errors.role}</p>}
      <Button>Add User</Button>
      {state.message && <p className="text-red-400 mt-2">{state.message}</p>}
    </form>

  );
}
