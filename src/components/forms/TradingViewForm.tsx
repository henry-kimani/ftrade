'use client';

import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, 
  DropdownMenuContent, DropdownMenuSeparator, 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function TradingViewForm(
  { databaseIndicators, checkedIndicators, handleIndicatorChange }:
  {
    databaseIndicators: string[],
    checkedIndicators: string[],
    handleIndicatorChange: (event: CheckedState, indicator: string) => void,
  }
) {

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Indicators</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-md">Choose Indicators</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form className="grid">
            {databaseIndicators.map((indicator) => 
              <Label key={indicator} className="p-2 rounded-md hover:bg-border/30 text-md" htmlFor={indicator}>
                <Checkbox 
                  id={indicator}
                  checked={checkedIndicators.includes(indicator)}
                  onCheckedChange={event => handleIndicatorChange(event, indicator)}
                />
                {humanizeIndicator(indicator)}
              </Label>
            )}
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function humanizeIndicator(indicators: string) {
  const matchAppersend = /[_]|[%]/g;
  return indicators.split(";")[1].replace(matchAppersend, " ");
}

