"use client";
import { createProfile } from "@/app/actions/createProfile";
import { getProfile } from "@/app/actions/getProfile";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddressInfo from "../Forms/AddressInfo";
import CareerInfo from "../Forms/CareerInfo";
import Confirmation from "../Forms/Confirmation";
import PersonalInfo from "../Forms/PersonalInfo";
import { FormValues, formSchema } from "../Forms/ProfileSchema";

export const ProfileUpdateModal = ({ userId }: { userId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: new Date(),
      phone: "",
      career: "",
      socialMediaLinks: [],
      address: "",
      country: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const { trigger, handleSubmit, clearErrors } = methods;

  if (!userId) return redirect("/sign-in");

  const steps = [
    {
      id: 1,
      label: "Personal Info",
      fields: ["firstName", "lastName", "dob", "phone"],
    },
    { id: 2, label: "Career", fields: ["career", "socialMediaLinks"] },
    {
      id: 3,
      label: "Address",
      fields: ["address", "country", "state", "city", "zip"],
    },
    {
      id: 4,
      label: "Verification",
      fields: [],
    },
  ] as const;

  type StepFields = (typeof steps)[number]["fields"];

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (profile && profile.data && !profile.error) {
        setCurrentStep(4);

        if (profile.data.user.verified) {
          redirect("/");
        }
      } else {
        setCurrentStep(1);
      }
    })();
  }, []);

  const validateAndSubmit = async () => {
    const stepFields = steps[currentStep - 1].fields as StepFields;
    const isValid = await trigger(stepFields);
    if (isValid) {
      handleSubmit(async (formdata) => {
        try {
          await createProfile({
            ...formdata,
            user: { connect: { clerkUserId: userId } },
            socialMediaLinks: {
              create: formdata.socialMediaLinks.map((link) => ({
                url: link.url,
                platform: link.platform,
              })),
            },
          });
          toast.success("Profile updated successfully", { autoClose: 1000 });
          setCurrentStep(4);
        } catch (err) {
          toast.error(err as string, { autoClose: 1000 });
        }
      })();
    }
  };

  const handleNext = async () => {
    const stepFields = steps[currentStep - 1].fields as StepFields;
    const isValid = await trigger(stepFields);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (currentStep === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 w-full">
      <div className="w-full">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                    index + 1 === currentStep
                      ? "bg-blue-500 text-white"
                      : index + 1 < currentStep
                      ? "bg-blue-300 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    index + 1 <= currentStep
                      ? "text-blue-500 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex-1 h-1 ${
                    index + 1 < currentStep ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <FormProvider {...methods}>
            <form className="space-y-8 w-full">
              {currentStep === 1 && <PersonalInfo clearErrors={clearErrors} />}
              {currentStep === 2 && <CareerInfo clearErrors={clearErrors} />}
              {currentStep === 3 && <AddressInfo clearErrors={clearErrors} />}
              {currentStep === 4 && <Confirmation />}
            </form>
          </FormProvider>
        </div>
      </div>
      {currentStep < 4 && (
        <div className="gap-4 flex justify-end  w-full">
          {currentStep > 1 && (
            <Button className="w-28" variant="outline" onClick={handlePrevious}>
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
              type="submit"
              onClick={validateAndSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
