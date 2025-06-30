import Metrics from "@/components/Metrics";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import Strategy from "@/components/strategy/Strategy";
import Notes from "@/components/Notes";
import React from "react";
import SiteHeader from "@/components/SiteHeader";
import { verifyUser } from "@/lib/dal";
import TradesCalendar from "@/components/calenders/TradesCalender";
import { getTradeDates } from "@/db/queries";
import { GroupedDatesType } from "@/lib/definitions";

export default async function Trades() {
  await verifyUser();

  const dates = await groupedDates();

  return (
    <>
      <div className="top-0 fixed w-full z-10 bg-background">
        <SiteHeader heading="trades">
          <TradesCalendar groupedDates={dates} />
        </SiteHeader>
      </div>
      <main className="max-w-3xl m-auto p-4 mt-12">
        <div className="grid place-items-center mb-8">
          <ScreenshotCarousel />
        </div>

        <div className="grid mb-4">
          <Strategy />
        </div>

        <div className="mb-4">
          <Metrics />
        </div>

        <div>
          <Notes />
        </div>
      </main>
    </>
  );
}

async function groupedDates(): Promise<GroupedDatesType> {
  // https://stackoverflow.com/questions/65678337/how-to-group-array-of-dates-by-month-and-year
  const tradeDates = await getTradeDates();

  return Object.values(tradeDates.reduce((accumulator, currentDate) => {
    const year = currentDate.entryTime.getFullYear();
    const month =  currentDate.entryTime.getMonth();
    const day = currentDate.entryTime.getDay();

    /* "When grouping things in general, its much easier to group them into an
     * object. Reason, is you don't have to search an array for a matching result
     * to append to, you only have to look up for a key to concatenate to." */

    /* The accumulator will have the values that have accumulated over time .
     * First, create a key, if not exists, which will be used as a unique 
     * identifier when we group.
     * For each date, concatenate it to the unique key constructed, if the key
     * it constructs exists, it is reused */
    const key = `${year}_${month}`; // Create a key to concatenate to
    // create a new key, if it exists add the following object to that object
    accumulator[key] = accumulator[key] || { month, year, dates: []};
    // Add the dates with their id's
    accumulator[key].dates.push({ id: currentDate.id, day });

    return accumulator;
  }, {}));
}
