'use client';

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutForm() {
  return (
    <div>
      <form action={logoutAction}>
        <Button>Log Out <LogOut /></Button>
      </form>
    </div>
  );
}
