import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChoosePhaseForm from "../forms/ChoosePhaseForm";
import { getPhase, getPhases } from "@/db/queries";
import Link from "next/link";

export default async function Phases({ tradeId }: { tradeId: string }) {
  const phases = await getPhases();
  const defaultPhase  = await getPhase(tradeId);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phases</CardTitle>
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
