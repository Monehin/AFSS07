// schemas.ts
import { platformIds } from "@/utils/platformOptions";
import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required." }),

  lastName: z.string().nonempty({ message: "Last name is required." }),

  email: z
    .string({
      required_error: "Email address is required.",
      invalid_type_error: "Email address must be a string.",
    })
    .email("Invalid email address."),

  dob: z.preprocess((D) => {
    return D ? new Date(D as Date) : undefined;
  }, z.date().max(new Date(), { message: "Date of birth must be in the past." })),

  career: z.string().nonempty({ message: "Career is required." }),
});

export const SocialMediaLinkSchema = z.object({
  url: z.string().url({ message: "Invalid URL format." }),
  platform: z.enum(platformIds, {
    errorMap: () => ({ message: "Invalid social media platform selected." }),
  }),
});

// SocialMediaInfo Schema
export const socialMediaInfoSchema = z.object({
  socialMediaLinks: z.array(SocialMediaLinkSchema).optional().default([]),
});

// 5. **Contact Information Schema (Renamed from addressInfoSchema)**
export const contactInfoSchema = z.object({
  address: z.string().nonempty({ message: "Address is required." }),

  country: z.string().nonempty({ message: "Country is required." }),

  city: z.string().nonempty({ message: "City is required." }),

  state: z.string().nonempty({ message: "State is required." }),

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
