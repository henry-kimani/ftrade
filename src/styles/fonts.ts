import { Quicksand, Roboto, Nunito } from "next/font/google";

export const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ['latin'],
});

export const roboto = Roboto({
  weight: "400",
  subsets: ['latin']
});

export const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"]
})
