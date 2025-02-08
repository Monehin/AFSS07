import { clsx, type ClassValue } from "clsx";
import { Country } from "country-state-city";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDayandMonthDateString = (dob: Date | string | null) => {
  if (!dob) return "";
  const dt =
    typeof dob === "string"
      ? DateTime.fromISO(dob, { zone: "utc" }) // Force UTC
      : DateTime.fromJSDate(dob).setZone("utc"); // Convert Date object to UTC

  return dt.toFormat("d LLLL");
};

export const getCountryName = (iso: string | null) => {
  if (!iso) return null;
  const country = Country.getCountryByCode(iso);
  return country?.name || iso;
};
