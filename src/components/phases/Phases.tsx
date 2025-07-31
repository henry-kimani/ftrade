import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChoosePhaseForm from "../forms/ChoosePhaseForm";
import { getPhase, getPhases } from "@/db/queries";
import Link from "next/link";
import RefImageModal from "../modals/RefImageModal";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Phases({ tradeId }: { tradeId: string }) {
  const phases = await getPhases();
  const defaultPhase  = await getPhase(tradeId);

  const supabase = await createClient();
  const { data } = supabase.storage.from('references').getPublicUrl('ref-image.png');

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-lg">Phases</CardTitle>
          <div>
            {data.publicUrl &&
              <RefImageModal>
                <Image src={data.publicUrl} alt="reference image" width={300} height={200}/>
              </RefImageModal>
            }
          </div>
        </CardHeader>
        <CardContent className="">
          { phases.length > 0 ? 
            <div>
              <ChoosePhaseForm
                tradeId={tradeId}
                phases={phases} 
                defaultPhase={defaultPhase}
              />
            </div>:
            <div className="text-muted-foreground">
              No Phases yet. Try adding some from the &nbsp;
              <Link className="underline" href={"/settings"}>settings</Link>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}
