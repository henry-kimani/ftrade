'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Role, roles } from "@/db/schema";
import { useActionState } from "react";
import { State } from "@/lib/schemas";
import { updateUserRoleAction } from "@/lib/actions/role";
import { Button } from "@/components/ui/button";

export default function UpdateRoleForm(
  { defaultValue, userId }:
  { defaultValue: Role, userId: string}
) {
  const initialState: State = { errors: {}, message: null };
  const updateUserRoleWithId = updateUserRoleAction.bind(null, userId);
  const [state, formAction] = useActionState(updateUserRoleWithId, initialState);

  return (
    <form action={formAction}>
      {/* We can name the variable role again below because it will we scoped*/}
      <RadioGroup 
        name="role" 
        className="grid pl-1" 
        defaultValue={defaultValue}
      >
        {roles.enumValues.map(role=> (
          <div key={role} className="p-1 flex item-center space-x-2">
            <RadioGroupItem value={role} id={role}/>
            <Label htmlFor={role}>{role}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button className="w-full mt-2" size="sm">Save</Button>
      {state?.message && <p className="text-red-400 mt-2">{state.message}</p>}
    </form>

  );
}
