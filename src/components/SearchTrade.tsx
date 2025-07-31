'use client';
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export default function TradesCalendar() {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearchTrade = useDebouncedCallback((searchTerm: string) => {
    // provides methods to work with search params instead of using complex strings
    const params = new URLSearchParams(searchParams);

    params.set('page', '1'); // Reset to page 1 when the user starts typing 
    if (searchTerm){
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }

    replace(`${pathname}?${params.toString()}`)
  }, 300);

  return (
    <div className="relative flex">
      <Input
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearchTrade(e.target.value)}
        placeholder="Search Trade..." 
        className="pl-10"
        type="search"
      />
      <Search className="absolute left-5 h-[18px] w-[18px] top-1/2 -translate-1/2 text-muted-foreground"/>
    </div>
  );
}

