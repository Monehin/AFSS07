"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  FieldError,
  FieldErrors,
  Path,
  UseFormClearErrors,
  useFormContext,
} from "react-hook-form";

import { FormValues } from "./schemas"; // Adjust the import path as needed

interface FloatingLabelFieldProps<T extends Path<FormValues>> {
  name: T;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  maxLength?: number; // Optional prop for character count
  clearErrors: UseFormClearErrors<FormValues>;
}

function FloatingLabelField<T extends Path<FormValues>>({
  name,
  label,
  type = "text",
  clearErrors,
}: FloatingLabelFieldProps<T>) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormValues>();

  const currentValue = watch(name); // Watch the current field value

  // Helper function to get nested errors
  const getNestedError = (
    errors: FieldErrors<FormValues>,
    path: string
  ): FieldError | undefined => {
    const keys = path.split(".");
    return keys.reduce<FieldErrors<FormValues> | FieldError | undefined>(
      (acc, key) => {
        if (acc && typeof acc === "object" && !("type" in acc)) {
          return acc[key as keyof typeof acc] as
            | FieldErrors<FormValues>
            | FieldError;
        }
        return undefined;
      },
      errors
    ) as FieldError | undefined;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let value: string | number | undefined;

        // Convert field value if needed
        if (type === "date" && field.value instanceof Date) {
          value = field.value.toISOString().split("T")[0];
        } else if (
          typeof field.value === "string" ||
          typeof field.value === "number"
        ) {
          value = field.value;
        } else {
          value = "";
        }

        const error = getNestedError(errors, name); // Check if there's an error
        const isValid = !error && currentValue; // Check if the field is valid

        return (
          <FormItem className="mb-6">
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  placeholder=" "
                  value={value} // Pass valid value to the input
                  onChange={(e) => {
                    const newValue =
                      type === "date"
                        ? new Date(e.target.value)
                        : e.target.value;
                    field.onChange(newValue);
                    clearErrors(name);
                  }}
                  className={`peer w-full appearance-none border-0 border-b pr-8 pl-1.5 rounded-none focus-visible:ring-0 ${
                    error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-gray-300 focus-visible:ring-blue-500"
                  }`}
                />
              </FormControl>

              {/* FLOATING LABEL */}
              <FormLabel
                className={`pointer-events-none absolute left-1 transition-all duration-200 transform ml-0.5 ${
                  value || currentValue
                    ? "top-[-0.7rem] text-xs text-grey-500" // Floating position when input has a value
                    : "top-2 text-base text-gray-500" // Default position
                } peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-0.7rem] peer-focus:text-xs peer-focus:text-grey-500`}
              >
                {label}
              </FormLabel>

              {/* ICON: Show error or success */}
              {error ? (
                <AlertCircle
                  className="w-5 h-5 text-red-500 absolute right-0 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              ) : isValid ? (
                <CheckCircle
                  className="w-5 h-5 text-green-500 absolute right-0 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              ) : null}
            </div>

            <FormMessage className="text-red-500 text-sm mt-1" />
          </FormItem>
        );
      }}
    />
  );
}

export default FloatingLabelField;
