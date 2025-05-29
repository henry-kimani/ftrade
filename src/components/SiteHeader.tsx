
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SiteHeading from "@/components/SiteHeading";
import ThemeToggle from "./ThemeToggle";

export default function  SiteHeader(
  { heading, children }:
  { heading: string, children?: React.ReactNode }
) {

  return(
    <header className="h-12 border-b flex items-center transition=[width,height] ease-linear">
      <div className="flex justify-between bg-red-400w w-full">
        <div className="flex items-center px-4 lg:px-6 gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className=" data-[orientation=vertical]:h-4" />
          <SiteHeading heading={heading} />
          { children && <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" /> }
          { children }
        </div>

        <div className="mr-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
