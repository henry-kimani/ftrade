import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function AddStrategyForm() {
  return (
    <form className="grid gap-5 ">
      <div className="flex items-center gap-3">
        <Checkbox className="size-7"/>
        <Input type="text" />
      </div>
      <Button className="">Add</Button>
    </form>
  );
}
