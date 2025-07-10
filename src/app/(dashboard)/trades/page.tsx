import SiteHeader from "@/components/SiteHeader";
import { verifyUser } from "@/lib/dal";
import SearchTrade from "@/components/SearchTrade";
import TradesTable from "@/components/tables/TradesTable";
import Pagination from "@/components/Pagination";
import { getTradesPages } from "@/db/queries";

export default async function Trades(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>
}) {
  await verifyUser();

  const searchParams = await props.searchParams;
  const searchTerm = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1; // default to page 1

  /* Return the total number of pages based on the query */
  const totalPages = await getTradesPages(searchTerm);

  return (
    <>
      <div className="top-0 fixed w-full z-10 bg-background">
        <SiteHeader heading="trades" />
      </div>
      <main className="m-auto p-4 mt-12">

        <div className="mb-8 w-full">
          <SearchTrade />
        </div>

        <div>
          <TradesTable query={searchTerm} currentPage={currentPage} />
        </div>

        <div className="grid place-items-center mt-4">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </>
  );
}


