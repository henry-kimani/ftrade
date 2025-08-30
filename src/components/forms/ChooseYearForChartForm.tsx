'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";


export default function ChooseYearForChartForm({
  yearsToChoose
}: {
    yearsToChoose: {
      year: number
    }[]
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSelectChange(searchTerm: string) {
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      params.set('year', searchTerm);
    } else {
      params.delete('year');
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      <Select defaultValue={searchParams.get('year')?.toString()} onValueChange={(value) => handleSelectChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {yearsToChoose.map(({ year }) => (
            <SelectItem 
              key={year}
              value={String(year)} 
            >{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
