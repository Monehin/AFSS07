"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { platformOptions } from "@/utils/platformOptions";
import { SocialIcon } from "react-social-icons";

import { X } from "lucide-react";

import React, { useEffect, useRef } from "react";
import {
  UseFormClearErrors,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { FormValues } from "./schemas"; // Adjust the import path as needed

const SocialMediaInfo: React.FC<{
  clearErrors: UseFormClearErrors<FormValues>;
}> = ({ clearErrors }) => {
  const { control, getValues } = useFormContext<FormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialMediaInfo.socialMediaLinks",
  });

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const addField = (platformId: string) => {
    const platform = platformOptions.find((option) => option.id === platformId);
    if (!platform) return;

    const existingLink = getValues("socialMediaInfo.socialMediaLinks").find(
      (link) => link.platform === platformId
    );
    if (existingLink) return;

    append({
      platform: platform.id,
      url: "",
    });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (fields.length > 0) {
      const lastIndex = fields.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }
  }, [fields.length]);

  return (
    <div className="space-y-6 m-4  md:m-8">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mb-2">Social Media</h2>
        {fields.length <= 4 && (
          <p className="text-gray-600 mb-2 font-medium">Select Platforms</p>
        )}
      </div>

      <div>
        <div className="flex gap-1 md:gap-8 mb-4 flex-wrap justify-center">
          {platformOptions.map(({ id, label }) => (
            <div
              key={id}
              className={`flex items-center gap-2 g-x-12 cursor-pointer ${
                fields.some((field) => field.platform === id) ? "hidden" : ""
              }`}
              onClick={() => addField(id)}
              aria-label={`Add ${label}`}
            >
              <SocialIcon network={id} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 ">
        {fields.map((field, index) => {
          const platform = platformOptions.find(
            (option) => option.id === field.platform
          );
          if (!platform) return null;

          const { icon: Icon, label, color, id } = platform;

          return (
            <div
              key={field.id}
              className="flex items-center gap-4 mb-4 md:mb-8  w-[90%] md:w-[80%] "
            >
              <FormField
                control={control}
                name={`socialMediaInfo.socialMediaLinks.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormControl>
                      <div className="relative">
                        <input
                          type="email"
                          className="peer py-3 pe-0 ps-2  block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-200 text-sm !outline-none"
                          placeholder={`${platform.basePath}username`}
                          {...field}
                          value={field.value || ""}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            clearErrors("socialMediaInfo.socialMediaLinks");
                          }}
                        />
                        <div className="absolute inset-y-0 start-[-25] flex items-center pointer-events-none ps-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                          <div
                            className=" items-center gap-2 hidden"
                            style={{ color }}
                          >
                            {Icon && <SocialIcon network={id} />}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="outline"
                className="ml-auto"
                onClick={() => removeField(index)}
                aria-label={`Remove ${label}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaInfo;
