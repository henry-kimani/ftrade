
import React from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { CircleEllipsisIcon, Pencil, Trash2 } from "lucide-react";

export default function Notes() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="mb-2">Notes</CardTitle>
            <CardDescription>Notes relating to this current trade</CardDescription>
          </div>
          <div>
            <EditNotesDropdown />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </div>
      </CardContent>
    </Card>
  );
}

function EditNotesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span><CircleEllipsisIcon /></span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
        <DropdownMenuItem>
          <span className="flex justify-between items-center w-full">Edit <Pencil /></span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex justify-between items-center w-full">Delete <Trash2 /></span>
        </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
