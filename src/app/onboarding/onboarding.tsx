"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProfile } from "./_actions/createProfile";

const FormSchema = z.object({
  country: z.string().nonempty({ message: "Country is required." }),
  dob: z.preprocess((D) => {
    return D ? new Date(D as Date) : undefined;
  }, z.date().max(new Date(), { message: "Date of birth must be in the past." })),
  email: z.string().email({ message: "Invalid email address." }),
});

export function Onboarding({ userId }: { userId: string }) {
  const [countries] = React.useState(Country.getAllCountries());
  const [loading, setLoading] = React.useState(false); // Loading state

  const date = new Date();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      country: "",
      dob: date,
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true); // Set loading to true
    try {
      const profile = await createProfile({
        ...data,
        user: { connect: { clerkUserId: userId } },
      });

      if (profile.error) {
        toast.error(profile.error, { autoClose: 1000 });
      } else {
        toast("Form submitted successfully!", {
          onClose: () => setLoading(false), // Reset loading after toast finishes
        });
      }
    } catch (error) {
      toast.error(`An error occurred while submitting the form., ${error}`, {
        autoClose: 1000,
      });
      setLoading(false); // Reset loading on error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country of Residence</FormLabel>
              <Select
                onValueChange={(isoCode) => {
                  field.onChange(isoCode);
                }}
                value={field.value || ""}
              >
                <FormControl className="focus:ring-0 focus:outline-none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="focus:ring-0 focus:outline-none">
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <input
                  type="date"
                  id="dob"
                  value={field.value.toString() ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 focus:ring-0 focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  id="email"
                  value={field.value.toString() ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1  focus:ring-0 focus:outline-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={loading || !form.formState.isDirty}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
