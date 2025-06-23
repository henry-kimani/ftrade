import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import MetricsTable from "./tables/MetricsTable";

export default function Metrics() {
  return (
    <Card className="">
      <CardContent>
        <MetricsTable />
      </CardContent>
    </Card>
  );
}

