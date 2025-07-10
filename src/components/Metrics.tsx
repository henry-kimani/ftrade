import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MetricsTable from "./tables/MetricsTable";

export default function Metrics({ tradeId }: { tradeId: string }) {
  return (
    <Card className="">
      <CardContent>
        <Suspense fallback="Loading Metrics...">
          <MetricsTable tradeId={tradeId} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

