import { EChartsOption } from "echarts";
import Echarts from "./Echarts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function MostUsedPhasesChart({
  data
}: {
    data: {
      phase: string,
      phaseCount: number
    }[]
  }) {

  if (!data) {
    return <div>
      No phase data yet.
    </div>;
  } 

  const chartData = data.map(d => ({ name: d.phase, value: d.phaseCount }));

  const options: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center"
    },
    series: [
      {
        name: "Phases",
        type: "pie",
        radius: [ "40%", "70%" ],
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "normal"
          }
        },
        labelLine: {
          show: false
        },
        data: chartData,
      }
    ]
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Most Used Phase</CardTitle>
          <CardDescription>A representation of the most used phase.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* @ts-expect-error provided the required props and it works */}
          <Echarts option={options} />
        </CardContent>
      </Card>
    </div>
  );
}
