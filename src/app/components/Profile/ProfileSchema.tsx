// schemas.ts
import { z } from "zod";

// Define all schemas
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  dob: z.preprocess((D) => {
    return D ? new Date(D as Date) : undefined;
  }, z.date().max(new Date(), { message: "Date of birth must be in the past." })),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits." }),
});

const SocialMediaLinkSchema = z.object({
  url: z.string(),
  platform: z.string(),
});

export const SocialMediaLinksSchema = z.array(SocialMediaLinkSchema);

export const careerInfoSchema = z.object({
  career: z
    .string()
    .min(2, { message: "Career must be at least 2 characters." }),
  socialMediaLinks: SocialMediaLinksSchema,
});

export const addressInfoSchema = z.object({
  address: z.string().nonempty({ message: "Address is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  city: z.string().nonempty({ message: "City is required." }),
  state: z.string().nonempty({ message: "State is required." }),
  zip: z.string().min(5, { message: "ZIP code must be at least 5 digits." }),
});

export const formSchema = personalInfoSchema
  .merge(careerInfoSchema)
  .merge(addressInfoSchema);

export type FormValues = z.infer<typeof formSchema>;
