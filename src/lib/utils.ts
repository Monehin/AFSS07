import { clsx, type ClassValue } from "clsx";
import { Country } from "country-state-city";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDayandMonthDateString = (dob: Date | string | null) => {
  if (!dob) return "";
  const date = new Date(dob);
  const day = date.getUTCDate();
  const month = date.toLocaleString("default", {
    month: "long",
    timeZone: "UTC",
  });
  return `${day} ${month}`;
};

export const getCountryName = (iso: string | null) => {
  if (!iso) return null;
  const country = Country.getCountryByCode(iso);
  return country?.name || iso;
};
