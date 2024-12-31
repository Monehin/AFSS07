"use client";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AddressInfo from "../Profile/AddressInfo";
import CareerInfo from "../Profile/CareerInfo";
import PersonalInfo from "../Profile/PersonalInfo";
import { FormValues, formSchema } from "../Profile/ProfileSchema";

export function VerifyModal() {
  const { setOpen } = useModal();

  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dob: "",
      phone: "",
      career: "",
      social_media_links: [],
      address: "",
      country: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const { trigger, handleSubmit, formState, clearErrors } = methods;

  const steps = [
    { id: 1, label: "Personal Info", fields: ["name", "dob", "phone"] },
    { id: 2, label: "Career Info", fields: ["career", "social_media_links"] },
    {
      id: 3,
      label: "Address Info",
      fields: ["address", "country", "state", "city", "zip"],
    },
  ] as const;

  type StepFields = (typeof steps)[number]["fields"];

  const validateAndSubmit = async () => {
    const stepFields = steps[currentStep - 1].fields as StepFields;
    const isValid = await trigger(stepFields);
    if (isValid) {
      handleSubmit((values) => {
        console.log("Submitted Values:", values);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [setOpen]);

  return (
    <div className="py-40  flex items-center justify-center">
      <ModalBody>
        <ModalContent>
          <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
            Please complete your verification by filling the form below
          </h4>
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Step Circle */}
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
                  {/* Step Label */}
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

            {/* Progress Bar */}
            <div className="flex items-center mt-2">
              {steps.map((_, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <div
                      className={`flex-1 h-1 ${
                        index < currentStep ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <FormProvider {...methods}>
              <form className="space-y-8 w-full">
                {currentStep === 1 && (
                  <PersonalInfo clearErrors={clearErrors} />
                )}
                {currentStep === 2 && <CareerInfo clearErrors={clearErrors} />}
                {currentStep === 3 && <AddressInfo clearErrors={clearErrors} />}
              </form>
            </FormProvider>
          </div>
        </ModalContent>
        <ModalFooter className="gap-4">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
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
        </ModalFooter>
      </ModalBody>
    </div>
  );
}
