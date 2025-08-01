'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { insertPhaseAction } from "@/lib/actions/phase";
import { State } from "@/lib/schemas";

export default function AddPhasesForm() {

  const initialState: State = { errors: {}, message: null };
  const [state, formAction] = useActionState(onSubmit, initialState);

  const [currentPhase, setCurrentPhase] = useState<string | undefined>();
  const [currentPhaseColor, setCurrentPhaseColor ] = useState<string | undefined>();

  const [addedPhases, setAddedPhases ] = useState<{ phase: string, phaseColor: string}[] | undefined>();

  function addCurrentPhase() {
    if (!(currentPhase && currentPhaseColor)) {
      return;
    }

    /* First time */
    if (!addedPhases) {
      setAddedPhases([{ phase: currentPhase, phaseColor: currentPhaseColor }]);

      /* Clear state*/
      setCurrentPhase("");
      setCurrentPhaseColor("");
      return;
    }

    const clone = addedPhases.slice();

    clone.push({ phase: currentPhase, phaseColor: currentPhaseColor });
    setAddedPhases(clone);

    /* Clear state*/
    setCurrentPhase("");
    setCurrentPhaseColor("");

  }

  function removePhaseFromList({ phase, phaseColor }: { phase: string, phaseColor: string }) {
    if (!addedPhases) return;

    const clone = addedPhases.slice();
    setAddedPhases(
      clone.filter((addedPhase) => addedPhase.phase !== phase || addedPhase.phaseColor !== phaseColor)
    )
  }

  async function onSubmit() {
    const formData = new FormData();

    formData.append("added-phases", JSON.stringify(addedPhases));

    return await insertPhaseAction(formData);
  }

  return (
    <div>
      <form action={formAction}>
        <div className="mb-4">
          <h3 className="font-semibold my-2 text-sm">Phases To Added</h3>
          {(addedPhases && addedPhases.length !== 0) ?
            addedPhases.map((addedPhase, index) => (
              <div key={index} className="flex items-center justify-between my-2">
                <p>{addedPhase.phase}</p>
                <div className="flex gap-2">
                  <div className="size-9 rounded-md" style={{ backgroundColor: addedPhase.phaseColor }}></div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-400"
                    onClick={() => removePhaseFromList({ phase: addedPhase.phase, phaseColor: addedPhase.phaseColor })}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )) :
            <div className="text-xs text-muted-foreground">No phases added.</div>
          }
          {state?.errors?.addedPhases &&
            state.errors.addedPhases.map(err => <p className="mt-2 text-red-400">{err}</p>)
          }
        </div>
        <div className="flex gap-4">
          <Input 
            className="basis-2/3"
            value={currentPhase}
            type="text"
            onChange={(e) => setCurrentPhase(e.currentTarget.value)}
          />
          <Input
            value={currentPhaseColor}
            className="basis-1/3 grow-0"
            type="color"
            onChange={(e) => setCurrentPhaseColor(e.currentTarget.value)}
          />
          <Button 
            type="button"
            className="flex-none"
            size="icon" 
            variant="outline"
            onClick={() => addCurrentPhase()}
          >
            <Plus />
          </Button>
        </div>
        <Button
          type="submit"
          className="mt-4 w-full"
        >Submit</Button>
        {state?.message && <p className="mt-2 text-red-400">{state.message}</p>}
      </form>
    </div>
  );
}

