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
    <form ref={formRef} action={formAction} className="">
      <div className="relative">
        <Label htmlFor="avatar-input" 
          className="text-muted-foreground absolute z-10 top-1/2 -translate-y-1/2"
        >
          <div className="hover:bg-secondary flex items-center p-2 gap-2 rounded-md transition-colors">
            <span>Upload</span>
            <ImageUpIcon />
          </div>
        </Label>
        <Input
          id="avatar-input"
          name="avatar"
          className="opacity-0 w-10"
          placeholder="profile"
          onChange={(e) => handleInputChange(e)} 
          type="file"
        />
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
