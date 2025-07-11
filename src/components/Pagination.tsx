'use client';

import { generatePagination } from "@/lib/utils";
import clsx from "clsx";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Button } from "./ui/button";

/* Create the pagination numbers with links that change the url page param */
export default function Pagination(
  { totalPages }:
  { totalPages: number }
){
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')?.toString() || 1);

  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  // Set the page params on navigation
  return (
    <div className="inline-flex">
      <PaginationArrow 
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <=1}
      />
      <div className="flex">
        {allPages.map((page, index) => {
          let position:'first' | 'last' | 'middle' | 'single' | undefined;
          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';

          return (
            <PaginationNumber 
              key={page}
              position={position}
              href={createPageURL(page)}
              isActive={currentPage === page}
              page={page}
            />
          );
        })}
      </div>
      <PaginationArrow 
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber(
  { href, page, position, isActive }:
  {
    href: string;
    page: number | string;
    position?: 'first' | 'last' | 'middle' | 'single';
    isActive: boolean;
  }
) {
  const className = clsx(
    "flex h-10 w-10 rounded-none",
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10': isActive,
      '': !isActive && position !== 'middle',
      'text-muted-foreground': position === 'middle'
    },
  );

  return isActive ? (
    <Button
      className={className}>{page}</Button>
  ): position === 'middle' ? (
    <Button className={className} variant={"secondary"}>{page}</Button>
  ): (
    <Button
      asChild
      className={className}
      variant="outline"
    >
      <Link href={href}>
        {page}
      </Link>
    </Button>
  );
}

function PaginationArrow(
  { href, direction, isDisabled }:
  {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
  }
) {
  const className = clsx(
    "flex h-10 w-10",
    {
      "mr-2 md:mr-4": direction === 'left',
      "ml-2 md:ml-4": direction === 'right',
    }
  );
  const icon = direction === 'left' ? (
  <ArrowLeftIcon className="w-4" />
  ) : (
  <ArrowRightIcon className="w-4"/>
  );

  return isDisabled ? (
    <Button 
      className={className}
      disabled
      variant="outline"
      size="icon"
    >{icon}</Button>
  ) : (
      <Button 
        className={className}
        asChild 
        variant="outline"
        size="icon"
      >
        <Link href={href}>
          {icon}
        </Link>
      </Button>
    );
}
