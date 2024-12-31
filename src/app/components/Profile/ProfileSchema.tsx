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
  dob: z.string().nonempty({ message: "Date of birth is required." }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits." }),
});

export const careerInfoSchema = z.object({
  career: z
    .string()
    .min(2, { message: "Career must be at least 2 characters." }),
  social_media_links: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url({ message: "Must be a valid URL." }),
    })
  ),
});

export const addressInfoSchema = z.object({
  address: z.string().nonempty({ message: "Address is required." }),
  country: z.string().nonempty({ message: "Country is required." }),
  city: z.string().nonempty({ message: "City is required." }),
  state: z.string().nonempty({ message: "State is required." }),
  zip: z.string().min(5, { message: "ZIP code must be at least 5 digits." }),
});

// Combine schemas into a single form schema
export const formSchema = personalInfoSchema
  .merge(careerInfoSchema)
  .merge(addressInfoSchema);

// Export the inferred type for use
export type FormValues = z.infer<typeof formSchema>;
