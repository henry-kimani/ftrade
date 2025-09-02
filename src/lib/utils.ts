import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GroupedStrategies, GroupedTradingPlanStrategiesWithId, GroupedStrategiesWithIds  } from "@/lib/definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSentenceCase(string: string) {
  const capitalizedChar = string.charAt(0).toUpperCase();
  const matchFirstChar = /^./gi;
  return string.replace(matchFirstChar, capitalizedChar);
}

export function isObjEmpty(obj: object) {
  for (const _ in obj) return true;
  return false;
}

// https://stackoverflow.com/questions/65678337/how-to-group-array-of-dates-by-month-and-year

/* "When grouping things in general, its much easier to group them into an
 * object. Reason, is you don't have to search an array for a matching result
 * to append to, you only have to look up for a key to concatenate to." */

/* The accumulator will have the values that have accumulated over time .
 * First, create a key, if not exists, which will be used as a unique 
 * identifier when we group.
 * For each date, concatenate it to the unique key constructed, if the key
 * it constructs exists, it is reused */

export function toGroupedStrategies(
  args:
  {
    strategy: string | null;
    tradingPlan: string;
  }[]
) {
  const data: GroupedStrategies = {};
  const grouped = Object.groupBy(args, ({ tradingPlan }) => tradingPlan);
  Object.keys(grouped).forEach(key => {
    if (grouped[key]) {
      data[key] = {
        strategies: grouped[key].map(({ strategy }) => strategy ? strategy : "")
      }
    }
  });
  return data;
};


export function toGroupedStrategiesWithIds(props: 
  {
    tradingPlanId: string;
    tradingPlan: string;
    strategyId: string;
    strategy: string | null;
  }[]
): GroupedStrategiesWithIds {

  // @ts-expect-error yet to figure out
  return Object.values(props.reduce((accumulator, currentValue) => {
    const { tradingPlanId, tradingPlan, strategyId, strategy } = currentValue;
    const key = tradingPlanId;

    // @ts-expect-error yet to figure out
    accumulator[key] = accumulator[key] || { tradingPlanId, tradingPlan, strategiesWithIds: [] };
    // @ts-expect-error yet to figure out
    accumulator[key].strategiesWithIds.push({ strategyId, strategy });

    return accumulator;
  }, {}))[0];
}


export function toGroupedTradingPlanStrategiesWithId(props:
  {
    tradingPlanId: string;
    tradingPlan: string;
    strategy: string | null;
  }[]
):GroupedTradingPlanStrategiesWithId {

  return Object.values(props.reduce((accumulator, currentValue) => {
    const { tradingPlanId, tradingPlan, strategy } = currentValue;
    const key = tradingPlanId;

    // @ts-expect-error yet to figure out
    accumulator[key] = accumulator[key] || { tradingPlanId, tradingPlan, strategies: [] };
    // @ts-expect-error yet to figure out
    accumulator[key].strategies.push(strategy);

    return accumulator;
  }, {}));

}


export function generatePagination(currentPage: number, totalPages: number) {
  /* If the number of pages is 7 or less, display all pages with any ellipsis */
  if (totalPages <=7 ) {
    return Array.from({ length: totalPages }, (_, i) => i+ 1);
  }

  /* If the current page is among the first 3 pages, show the first 3, an
   * ellipsis and the last 2 pages. */
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  /* If the current page is among the last three pages, show the first 2 pages,
   * an ellipsis and the last 3 pages. */
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  /* If the current page is somewhere in the middle, show the first page, an 
   * ellipsis, the current page and its neighbours another ellipsis and 
   * the last page */
  return [
    1,
    '...',
    currentPage - 1,
    currentPage, 
    currentPage + 1,
    '...',
    totalPages
  ];
}


export function genPathName(
  type: "avatar" | "ref" | "shot", 
  id: string, 
  file: File
){
  const fileExt = file.name.split(".").pop();
  if (type === "avatar") {
    return `${id}.${fileExt}`;
  } else if (type === "ref") {
    return `ref-image.${fileExt}`;
  } else {
    return `${id}/${Math.random()}.${fileExt}`;
  }
}


export function calculateRatio(num1: number | undefined, num2: number | undefined) {
  // Check if the numbers are defined
  if (!(num1 && num2)) {
    return undefined;
  }

  // Check if the numbers are zero
  if (num1 === 0) {
    return [ num1, 0 ];
  }

  if (num2 === 0) {
    return [ 0, num2 ];
  }

  // Get rid of negative number
  num1 = Math.abs(num1);
  num2 = Math.abs(num2);

  const remainder = num1 % num2;

  if (remainder === 0) {
    if (num1 > num2) {
      return [ Math.floor(num1/num2) , 1 ];
    } else {
      return [ 1, Math.floor(num2/num1) ];
    }
  } else {
    return [ num1, num2 ];
  }
}
