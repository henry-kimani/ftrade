import { deleteScreenshotAction } from "@/lib/actions/screenshots";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteScreenshot(
  { screenshotId, screenshotPath }:
  { 
    screenshotId: string;
    screenshotPath: string;
  }
) {
  const deleteScreenshotActionWithId = deleteScreenshotAction.bind(null, screenshotId, screenshotPath);

  return (
    <form className="w-full" action={deleteScreenshotActionWithId}>
      <Button variant="outline" className="w-full">
        <Trash2 />
      </Button>
    </form>
  );
}
