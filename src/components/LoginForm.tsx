'use client';

import { useActionState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/actions";
import { State } from "@/lib/schemas";

export default function LoginForm() {

  const initialState: State = { errors: {}, message: null };
  const [state, formAction] = useActionState(login, initialState);

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="grid place-items-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={formAction}
          aria-describedby="form-errors"
          aria-live="polite"
          aria-atomic
        >
          <Label htmlFor="email" />
          <Input id="email" name="email" type="email" placeholder="Email" 
            aria-describedby="email-error" aria-live="polite" aria-atomic
          />
          { state.errors?.email && <p id="email-error" className="mt-2 text-red-400">{state.errors.email}</p>}
          <Button>Log In</Button>
        </form>
        {state.message && <p id="form-errors" className="mt-2 text-red-400">{state.message}</p>}
      </CardContent>
    </Card>
  );
}
