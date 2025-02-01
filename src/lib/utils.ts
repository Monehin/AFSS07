import { clsx, type ClassValue } from "clsx";
import { Country } from "country-state-city";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDayandMonthDateString = (dob: Date | string | null) => {
  if (!dob) return "";
  const options: any = { setZone: true };
  const dt =
    typeof dob === "string"
      ? DateTime.fromISO(dob, options)
      : DateTime.fromJSDate(dob, options);
  return dt.toFormat("d LLLL");
};

export const getCountryName = (iso: string | null) => {
  if (!iso) return null;
  const country = Country.getCountryByCode(iso);
  return country?.name || iso;
};
