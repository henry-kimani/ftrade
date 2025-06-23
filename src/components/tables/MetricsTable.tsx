import { toSentenceCase } from "@/lib/utils";


export default function MetricsTable() {

  const data = [
    {
      metric: "profit",
      value: 20,
    },
    {
      metric: "entry",
      value: 20,
    },
    {
      metric: "exit",
      value: 20,
    },
    {
      metric: "balance",
      value: 20,
    },
    {
      metric: "lot size",
      value: 20,
    },
    {
      metric: "ratio",
      value: 20,
    }
  ];

  return (
    <table className="table min-w-full">
      <thead className="border-b text-left *:font-bold *:text-sm *:text-muted-foreground">
        <tr>
          <td className="px-3 py-4">METRIC</td>
          <td className="px-3 py-4">VALUE</td>
        </tr>
      </thead>
      <tbody className="divide-y border-b">
        {data.map(({ metric, value }) => (
          <tr key={metric}>
            <td className="truncate pl-4 pr-3 py-4">
              {toSentenceCase(metric)}
            </td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
