'use client';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar1, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { GroupedDatesType, SelectedDate } from "@/lib/definitions";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function TradesCalendar(
  { groupedDates }:
  { groupedDates: GroupedDatesType }
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearchTrade(date: SelectedDate) {
    // provides methods to work with search params instead of using complex strings
    const params = new URLSearchParams(searchParams);

    if (date?.id){
      params.set('trade', date.id);
    } else {
      params.delete('trade');
    }

    replace(`${pathname}?${params.toString()}`)
  }

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
                  <span>Select a trade</span>
                  <Calendar1 />
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <div>
                  <Command>
                    <CommandInput placeholder="Search a trade by date" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {groupedDates.map((date, index) => (
                        <CommandGroup key={index} heading={
                          <div>
                            {format(new Date(date.year, date.month, 0), "MMM y").toUpperCase()}
                          </div>
                        }>
                          {date.dates.map(({ id, day }) => {
                            const currentDate = new Date(date.year, date.month, day);
                            return (
                              <CommandItem key={day}>
                                <Button 
                                  onClick={() => handleSearchTrade({ id, currentDate })}
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

