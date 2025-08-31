import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import AddPhasesForm from "./forms/AddPhasesForm";
import AddPhasesModal from "./modals/AddPhaseModal";
import { getPhases } from "@/db/queries";
import { toSentenceCase } from "@/lib/utils";
import RefImageForm from "@/components/forms/RefImageForm";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { isCurrentUserAdmin } from "@/lib/dal";

export default async function AddPhases() {

  const isAdmin = await isCurrentUserAdmin();

  const phases = await getPhases();

  const supabase = await createClient();

  const { data } = supabase.storage.from('references').getPublicUrl("ref-image.png");

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-lg">Manage Phases</CardTitle>
            <CardDescription>
              Manage phases, their color and the reference image.
            </CardDescription>
          </div>
          { isAdmin && <div className="flex gap-2">
            <RefImageForm />
            <AddPhasesModal>
              <AddPhasesForm />
            </AddPhasesModal>
          </div> }
        </CardHeader>
        <CardContent>
          <div className="grid place-items-center">
            {data.publicUrl && 
              <Image
                src={data.publicUrl}
                alt="Reference Image"
                width={300}
                height={200}
              />}
          </div>
          {phases && phases.map(({ id, phase, phaseColor }) => (
            phaseColor &&
            <div key={id} className="flex justify-between items-center my-2">
              <span>{toSentenceCase(phase)}</span>
              <div className="size-9 rounded-md" style={{ backgroundColor: phaseColor }}></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
