'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadAvatarAction } from "@/lib/actions";
import { ImageUpIcon } from "lucide-react";
import { ChangeEvent, useActionState, useRef } from "react";

export default function AvatarForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { errors: {}, message: null };
  const [state, formAction] = useActionState(uploadAvatarAction, initialState);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={formAction}>
      <div>
        <Label className="text-muted-foreground">
          <div className="hover:bg-secondary flex items-center p-2 gap-2 rounded-md transition-colors">
            <span>Upload</span>
            <ImageUpIcon />
          </div>
          <Input
            name="avatar"
            className="scale-0 hover:cursor-pointer"
            placeholder="profile"
            onChange={(e) => handleInputChange(e)} 
            type="file"
          />
        </Label>
        {state?.errors?.avatar &&
          state.errors.avatar.map((error, index) => 
            <p key={index} className="text-red-400 mt-2">{error}</p>
          )
        }
        {state?.message && <p className="mt-2 text-red-400">{state.message}</p>}
      </div>
    </form>
  );
}
