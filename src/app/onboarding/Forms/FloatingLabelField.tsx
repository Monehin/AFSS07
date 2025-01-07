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

  // Helper to decide if a field is "success" (value present, no error)
  const isSuccess = () => {
    const val = watch(name);
    return !!val && !getNestedError(errors, name);
  };

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
        let fieldValue: string | number | undefined;

        return (
          <FormItem className="mb-6">
            <div className="relative">
              <FormControl>
                <Input
                  {...field}
                  type={type}
                  placeholder=" "
                  value={fieldValue}
                  onChange={(e) => {
                    field.onChange(
                      type === "date"
                        ? new Date(e.target.value)
                        : e.target.value
                    );
                    clearErrors(name);
                  }}
                  className={`
                    peer w-full
                    appearance-none
                    border-0 border-b border-gray-300
                    focus-visible:ring-0
                    pr-8
                    pl-1.5
                    rounded-none
                    ${getNestedError(errors, name) ? "border-red-500" : ""}
                  `}
                />
              </FormControl>

              {/* FLOATING LABEL */}
              <FormLabel
                className={`
                  pointer-events-none
                  absolute left-1
                  text-gray-500
                  transition-all duration-200 transform
                  ml-0.5
                  top-2 text-base
                  peer-focus:top-[-0.7rem]
                  peer-focus:text-xs
                  peer-[&:not(:placeholder-shown)]:top-[-0.7rem]
                  peer-[&:not(:placeholder-shown)]:text-xs
                `}
              >
                {label}
              </FormLabel>

              {/* ERROR or SUCCESS ICON */}
              {getNestedError(errors, name) ? (
                <AlertCircle
                  className="w-5 h-5 text-red-500 absolute right-0 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
              ) : isSuccess() ? (
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
