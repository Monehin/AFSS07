// schemas.ts
import { platformIds } from "@/utils/platformOptions";
import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(50, { message: "First name cannot exceed 50 characters." }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(50, { message: "Last name cannot exceed 50 characters." }),

  email: z
    .string()
    .email({ message: "Invalid email address." })
    .nonempty({ message: "Email address is required." }),

  dob: z.preprocess((D) => {
    return D ? new Date(D as Date) : undefined;
  }, z.date().max(new Date(), { message: "Date of birth must be in the past." })),

  career: z
    .string()
    .min(2, { message: "Career must be at least 2 characters long." })
    .max(100, { message: "Career cannot exceed 100 characters." }),
});

export const SocialMediaLinkSchema = z.object({
  url: z.string().url({ message: "Invalid URL format." }),
  platform: z.enum(platformIds, {
    errorMap: () => ({ message: "Invalid social media platform selected." }),
  }),
});

// SocialMediaInfo Schema
export const socialMediaInfoSchema = z.object({
  socialMediaLinks: z
    .array(SocialMediaLinkSchema)
    .max(10, { message: "You can add up to 10 social media links." })
    .optional()
    .default([]),
});

// 5. **Contact Information Schema (Renamed from addressInfoSchema)**
export const contactInfoSchema = z.object({
  address: z
    .string()
    .nonempty({ message: "Address is required." })
    .max(100, { message: "Address cannot exceed 100 characters." }),

  country: z
    .string()
    .nonempty({ message: "Country is required." })
    .max(50, { message: "Country name cannot exceed 50 characters." }),

  city: z
    .string()
    .nonempty({ message: "City is required." })
    .max(50, { message: "City name cannot exceed 50 characters." }),

  state: z
    .string()
    .nonempty({ message: "State is required." })
    .max(50, { message: "State name cannot exceed 50 characters." }),

  zip: z.string().regex(/^\d{5}(-\d{4})?$/, {
    message: "Invalid ZIP code format. Use '12345' or '12345-6789'.",
  }),

  phone: z.string().regex(/^\+?\d{10,15}$/, {
    message:
      "Phone number must be between 10 to 15 digits, optionally starting with '+'.",
  }),
});

// 6. **Main Form Schema with Nested Structure**
export const formSchema = z.object({
  personalInfo: personalInfoSchema,
  socialMediaInfo: socialMediaInfoSchema,
  contactInfo: contactInfoSchema,
});

// 7. **Type Inference for Form Values**
export type FormValues = z.infer<typeof formSchema>;
