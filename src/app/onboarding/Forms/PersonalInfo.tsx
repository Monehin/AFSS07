"use client";

import { UseFormClearErrors } from "react-hook-form";
import FloatingLabelField from "./FloatingLabelField";
import { FormValues } from "../../../utils/schemas";

const PersonalInfo = ({
  clearErrors,
}: {
  clearErrors: UseFormClearErrors<FormValues>;
}) => {
  type PersonalInfoFieldNames = keyof FormValues["personalInfo"];

  const fields: Array<{
    name: `personalInfo.${PersonalInfoFieldNames}`;
    label: string;
    type?: string;
  }> = [
    { name: "personalInfo.firstName", label: "First Name" },
    { name: "personalInfo.lastName", label: "Last Name" },
    { name: "personalInfo.email", label: "Email Address", type: "email" },
    { name: "personalInfo.dob", label: "Date of Birth", type: "date" },
    { name: "personalInfo.career", label: "Career" }, // New Field
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
      </div>

      {fields.map(({ name, label, type }) => (
        <FloatingLabelField
          key={name}
          name={name}
          label={label}
          type={type}
          clearErrors={clearErrors}
        />
      ))}
    </div>
  );
};

export default PersonalInfo;
