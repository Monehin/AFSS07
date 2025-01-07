"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { platformOptions } from "@/utils/platformOptions"; // Ensure the path is correct
import { Trash } from "lucide-react";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Social Media Information</h2>
      <p className="text-gray-600 mb-6">Add your social media profiles.</p>

      <div>
        <h3 className="text-lg font-medium mb-4">Select Platforms</h3>
        <div className="flex gap-4 mb-4 flex-wrap">
          {platformOptions.map(
            ({ id, icon: Icon, label, color, background }) => (
              <Button
                key={id}
                variant="outline"
                className="flex items-center gap-2 border-2"
                onClick={() => addField(id)}
                disabled={fields.some((field) => field.platform === id)}
                aria-label={`Add ${label}`}
              >
                {background && (
                  <span style={{ background }}>
                    {" "}
                    {Icon && <Icon className="w-4 h-4" />}
                  </span>
                )}
                {color && (
                  <span style={{ color }}>
                    {" "}
                    {Icon && <Icon className="w-4 h-4" />}
                  </span>
                )}
              </Button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const platform = platformOptions.find(
            (option) => option.id === field.platform
          );
          if (!platform) return null;

          const { icon: Icon, label, color } = platform;

          return (
            <div
              key={field.id}
              className="flex items-center gap-4 border p-2 rounded"
            >
              <div className="flex items-center gap-2" style={{ color }}>
                {Icon && <Icon className="w-5 h-5" />}
              </div>

              <FormField
                control={control}
                name={`socialMediaInfo.socialMediaLinks.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={`${platform.basePath}yourusername`}
                        {...field}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          clearErrors("socialMediaInfo.socialMediaLinks");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="destructive"
                className="ml-auto"
                onClick={() => removeField(index)}
                aria-label={`Remove ${label}`}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {fields.length >= 10 && (
        <span className="text-red-500 text-sm">
          You can add up to 10 social media links.
        </span>
      )}
    </div>
  );
};

export default SocialMediaInfo;
