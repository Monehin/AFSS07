import { clsx, type ClassValue } from "clsx";
import { Country } from "country-state-city";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDayandMonthDateString = (dob: Date | null) => {
  if (!dob) return "";
  const date = new Date(dob);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  return `${day} ${month}`;
};

export const getCountryName = (iso: string | null) => {
  if (!iso) return null;
  const country = Country.getCountryByCode(iso);
  return country?.name || iso;
};
