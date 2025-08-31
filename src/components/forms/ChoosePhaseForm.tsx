'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertPhaseToTradeAction } from "@/lib/actions/phase";
import { toSentenceCase } from "@/lib/utils";
import { useRef } from "react";

type PhaseType = {
  id: string;
  phase: string;
  phaseColor: string | null;
};

export default function ChoosePhaseForm(
  { phases, defaultPhase, tradeId }:
  {
    tradeId: string;
    phases: PhaseType[];
    defaultPhase: PhaseType | undefined
  }
) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handlePhaseChange(value: string) {
    const formData = new FormData();
    formData.append("selected-phase-id", value);

    const insertPhaseToTradeWithTradeId = insertPhaseToTradeAction.bind(null, tradeId);
    await insertPhaseToTradeWithTradeId(formData);
  }

  return (
    <form ref={formRef}>
      <Select
        onValueChange={(value) => handlePhaseChange(value)} 
        defaultValue={defaultPhase?.id}
      >
        <SelectTrigger className="w-full min-h-14">
          <SelectValue placeholder="Choose a phase"/>
        </SelectTrigger>
        <SelectContent>
          {phases.map(({id, phase, phaseColor}) => (
            <SelectItem
              className="flex gap-2"
              value={id}
              key={id}
            >
              { phaseColor && <div className="size-8 rounded-md" style={{ backgroundColor: phaseColor }}></div> }
              <span>{toSentenceCase(phase)}</span>
            </SelectItem>
          ))}
          {/* state?.errors?.selectedPhaseId && state.errors.selectedPhaseId.map(err => <p className="mt-2 text-red-400">{err}</p>) */}
        </SelectContent>
      </Select>
      {/* state?.message && <p className="mt-2 text-red-400">{state.message}</p> */}
    </form>
  );
}
