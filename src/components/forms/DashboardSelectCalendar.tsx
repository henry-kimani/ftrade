'use client';

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { CalendarFoldIcon } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function DashboardSelectCalendar({ from, to }: {
  from: Date;
  to: Date;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [ date, setDate ] = useState<DateRange | undefined>({ from, to });

  function handleCalenderChange(dateRange: DateRange | undefined) {
    if (!dateRange) {
      return;
    }
    setDate(dateRange);

    const params = new URLSearchParams(searchParams);

    if (date && date.from && date.to) {
      params.set('from', date.from.toString());
      params.set('to', date.to.toString());
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <div 
        className="flex gap-2 items-center"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={"outline"} 
              className="flex justify-between w-auto"
            >
              {date && date.from && date.to ? 
                <div className="text-start">
                  <p>Fr: {format(date.from, "PP")}</p>
                  <p>To: {format(date.to, "PP")}</p>
                </div> :
                "Select Date..." 
              }
              <CalendarFoldIcon className="hidden sm:block" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={date}
              onSelect={(dateRange) => handleCalenderChange(dateRange)}
              captionLayout="dropdown"
              min={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
