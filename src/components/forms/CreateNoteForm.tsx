'use client';

import { Button } from "@/components/ui/button";
import { createNoteAction } from "@/lib/actions";
import { State } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { useActionState } from "react";

export default function CreateNoteForm({ tradeId }: { tradeId: string }) {
  const initialState: State = { errors: {}, message: null };
  const createNoteActionWithId = createNoteAction.bind(null, tradeId);
  const [state, formAction] = useActionState(createNoteActionWithId, initialState);
  return (
    <div>
      <form action={formAction}>
        <Button>Create Note <Plus /></Button>
      </form>
      {state?.message && <p className="text-red-400 mt-2">{state.message}</p>}
    </div>
  );
}
