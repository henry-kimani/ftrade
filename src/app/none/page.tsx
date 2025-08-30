import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NonePage() {
  return (
    <section className="grid place-items-center h-svh p-4">
      <div className="grid gap-4 *:text-center">
        <h1 className="text-2xl font-semibold">Welcome to Ftrade</h1>
        <p className="text-muted-foreground block">
          You are signed in. However, your current role is &lsquo;none&rsquo;.
          <br className="hidden sm:block"/>
          This means you are not allowed to see anything.
        </p>
        <Button asChild>
          <Link href="/dashboard">Try Again</Link>
        </Button>
      </div>
    </section>
  );
}
