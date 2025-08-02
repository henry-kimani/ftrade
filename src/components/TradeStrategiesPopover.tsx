import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { toSentenceCase } from "@/lib/utils";

export default function TradeStrategiesPopover(
  { triggerName, content }:
  { triggerName: string; content: React.ReactNode }
) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-between" variant="ghost">
          {toSentenceCase(triggerName)}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {content}
      </PopoverContent>
    </Popover>
  );
}
