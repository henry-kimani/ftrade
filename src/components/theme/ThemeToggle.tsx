'use client';

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme }  from "next-themes";

import { 
  DropdownMenu,
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger className="absolute z-20 right-5 top-1.5 grid place-items-center">
        <div className="border rounded-md p-2">
          <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
          <Moon className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
        </div>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
