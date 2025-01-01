"use client";
import { getProfile, updateProfile } from "@/app/actions";
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
import { toast } from "react-toastify";
import AddressInfo from "../Profile/AddressInfo";
import CareerInfo from "../Profile/CareerInfo";
import Confirmation from "../Profile/Confirmation";
import PersonalInfo from "../Profile/PersonalInfo";
import { FormValues, formSchema } from "../Profile/ProfileSchema";

export const ProfileUpdateModal = () => {
  const { setOpen } = useModal();
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateAndSubmit = async () => {
    const stepFields = steps[currentStep - 1].fields as StepFields;
    const isValid = await trigger(stepFields);
    if (isValid) {
      handleSubmit(async (formdata) => {
        console.log("Submitted Values:", formdata);
        try {
          await updateProfile(formdata);
          toast.success("Profile updated successfully");
          setCurrentStep(4);
        } catch (error) {
          toast.error("Failed to update profile");
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

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      if (profile && profile.data && !profile.error) {
        if (
          profile.data?.firstName &&
          profile.data?.lastName &&
          profile.data?.dob &&
          profile.data?.career &&
          profile.data?.phone &&
          profile.data?.address &&
          profile.data?.socialMediaLinks &&
          profile.data?.country &&
          profile.data?.city &&
          profile.data?.state &&
          profile.data?.zip
        ) {
          const socialMediaLinksRaw = profile.data?.socialMediaLinks;
          const socialMediaLinks =
            typeof socialMediaLinksRaw === "string"
              ? JSON.parse(socialMediaLinksRaw)
              : socialMediaLinksRaw;
          methods.reset({
            firstName: profile.data?.firstName,
            lastName: profile.data?.lastName,
            dob: new Date(profile.data?.dob),
            phone: profile.data?.phone,
            career: profile.data?.career,
            socialMediaLinks: socialMediaLinks,
            address: profile.data?.address,
            country: profile.data?.country,
            city: profile.data?.city,
            state: profile.data?.state,
            zip: profile.data?.zip,
          });
          setCurrentStep(4);
        }
      }
    })();
  }, [methods]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 500);
    return () => clearTimeout(timeout);
  }, [setOpen]);

  return (
    <div className="py-40 flex items-center justify-center">
      <ModalBody>
        <ModalContent>
          <h2 className="text-lg md:text-1xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
            Fill out the form below to verify your profile
          </h2>

          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center"
                >
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
                {currentStep === 1 && (
                  <PersonalInfo clearErrors={clearErrors} />
                )}
                {currentStep === 2 && <CareerInfo clearErrors={clearErrors} />}
                {currentStep === 3 && <AddressInfo clearErrors={clearErrors} />}
                {currentStep === 4 && <Confirmation />}
              </form>
            </FormProvider>
          </div>
        </ModalContent>
        {currentStep < 4 && (
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
        )}
      </ModalBody>
    </div>
  );
};
