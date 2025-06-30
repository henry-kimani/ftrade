'use client';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar1, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { GroupedDatesType } from "@/lib/definitions";

export default function TradesCalendar(
  { groupedDates }:
  { groupedDates: GroupedDatesType }
) {
  const [ selectedDate, setSelectedDate ] = useState<{ id: string, currentDate: Date } | undefined>();

  return (
    <div>
      <div>
        <form /*action={formActionWithId}*/ className="flex gap-2">
          <div className="">

            <Popover>
              <PopoverTrigger asChild className="text-muted-foreground">
                <Button
                  className="truncate max-w-32 @md/main:min-w-52 flex item-center justify-between"
                  size="default"
                  variant={"outline"}
                >
                  { 
                    selectedDate ?
                      <span className="">{format(selectedDate?.currentDate, "E PPP")}</span> 
                      : <span className="hidden @sm/main:block text-ellipsis">Select a date</span>
                  }
                  <Calendar1 />
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <div>
                  <Command>
                    <CommandInput placeholder="Search a trade by date" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {groupedDates.map(date => (
                        <CommandGroup heading={
                          <div>
                            {format(new Date(date.year, date.month, 0), "MMM Y").toUpperCase()}
                          </div>
                        }>
                          {date.dates.map(({ id, day }) => {
                            const currentDate = new Date(date.year, date.month, day);
                            return (
                              <CommandItem >
                                <Button 
                                  onClick={() => setSelectedDate({ id, currentDate })}
                                  variant="ghost"
                                >
                                  {format(currentDate, "E PPP")}
                                </Button>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            size="icon"
          >
            <Check />
          </Button>
        </form>
      </div>
      <div></div>
    </div>
  );
}

