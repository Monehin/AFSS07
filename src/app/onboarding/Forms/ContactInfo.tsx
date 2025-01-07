// ContactInfo.tsx
"use client";

import { UseFormClearErrors } from "react-hook-form";
import FloatingLabelField from "./FloatingLabelField"; // Adjust the import path as needed
import { FormValues } from "./schemas"; // Adjust the import path as needed

const ContactInfo = ({
  clearErrors,
}: {
  clearErrors: UseFormClearErrors<FormValues>;
}) => {
  // Define a specific type for contact info field names
  type ContactInfoFieldNames = keyof FormValues["contactInfo"];

  // Define your field configurations with full paths
  const fields: Array<{
    name: `contactInfo.${ContactInfoFieldNames}`;
    label: string;
    type?: string;
  }> = [
    { name: "contactInfo.address", label: "Address" },
    { name: "contactInfo.country", label: "Country" },
    { name: "contactInfo.city", label: "City" },
    { name: "contactInfo.state", label: "State" },
    { name: "contactInfo.zip", label: "ZIP Code", type: "text" },
    { name: "contactInfo.phone", label: "Phone", type: "tel" },
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
      <p className="text-gray-600 mb-6">Provide your contact details</p>

      {fields.map(({ name, label, type }) => (
        <FloatingLabelField
          key={name}
          name={name}
          label={label}
          type={type}
          clearErrors={clearErrors}
        />
      ))}

      {/* No button here */}
    </div>
  );
};

export default ContactInfo;
