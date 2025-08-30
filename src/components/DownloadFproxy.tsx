import Link from "next/link";
import { Button } from "./ui/button";

export default async function DownloadFproxy() {

  return (
    <div className="mt-8 grid gap-2">
      <h3 className="text-xl font-semibold">Download Fproxy</h3>
      <p className="text-muted-foreground">Download Fproxy for windows, Version 0.0.2.</p>
      <Button asChild variant={"secondary"}>
        <Link href="https://www.mediafire.com/folder/gjbitu8s9z39b/Fproxy">Download</Link>
      </Button>
    </div>
  );
}
