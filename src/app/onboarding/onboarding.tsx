// components/Forms/MainForm.tsx

"use client";
import { createProfile } from "@/app/onboarding/_actions/createProfile";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserWithProfile } from "../api/user/route";
import Confirmation from "./Forms/Confirmation";
import ContactInfo from "./Forms/ContactInfo"; // Ensure path is correct
import PersonalInfo from "./Forms/PersonalInfo";
import SocialMediaInfo from "./Forms/SocialMediaInfo"; // Updated path
import { FormValues, formSchema } from "./Forms/schemas";

export const Onboarding = ({ userId }: { userId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const userProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserWithProfile> => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        dob: new Date(), // Changed from Date to string to match schema
        career: "", // Retain if needed
      },
      socialMediaInfo: {
        socialMediaLinks: [],
      },
      contactInfo: {
        address: "",
        country: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      },
    },
  });
  const { trigger, handleSubmit, clearErrors } = methods;

  const steps = [
    {
      id: 1,
      label: "Personal Info",
      fields: [
        "personalInfo.firstName",
        "personalInfo.lastName",
        "personalInfo.email",
        "personalInfo.dob",
        "personalInfo.career",
      ],
    },
    {
      id: 2,
      label: "Contact",
      fields: [
        "contactInfo.address",
        "contactInfo.country",
        "contactInfo.city",
        "contactInfo.state",
        "contactInfo.zip",
        "contactInfo.phone",
      ],
    },
    {
      id: 3,
      label: "Social Media",
      fields: ["socialMediaInfo.socialMediaLinks"],
    },
  ] as const;

  type StepFields = (typeof steps)[number]["fields"];

  const { data: user, isLoading } = userProfile;

  useEffect(() => {
    if (!userId) {
      redirect("/sign-in");
      return;
    }

    if (user?.verified) {
      redirect("/");
    }

    if (user?.profile) {
      setCurrentStep(4);
    } else {
      setCurrentStep(1);
    }
  }, [user, userId]);

  const validateAndSubmit = async () => {
    const stepFields = steps[currentStep - 1].fields as StepFields;
    const isValid = await trigger(stepFields);
    console.log(isValid);
    if (isValid) {
      handleSubmit(async (formdata) => {
        console.log(formdata);
        const { personalInfo, contactInfo, socialMediaInfo } = formdata;
        const formInfo = { ...personalInfo, ...contactInfo };
        const profile = await createProfile({
          ...formInfo,
          user: { connect: { clerkUserId: userId } },
          socialMediaLinks: {
            create: socialMediaInfo.socialMediaLinks.map((link) => ({
              url: link.url,
              platform: link.platform,
            })),
          },
        });
        if (profile.error) {
          console.error(profile.error);
          toast.error(profile.error, { autoClose: 1000 });
        }
        if (profile.data) {
          toast.success("Profile updated successfully", { autoClose: 1000 });
          setCurrentStep(4);
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
    <SkeletonWrapper isLoading={isLoading} className="h-[225px] w-full">
      <div className="flex flex-col items-center justify-center gap-y-6 w-full">
        <div className="w-full flex flex-col items-center">
          {/* Step Indicator */}
          <div className="mb-6 w-[85%]">
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
          <Card className="w-[90%]">
            <CardContent className="p-0">
              <div className="flex justify-center items-center">
                <FormProvider {...methods}>
                  <form className="space-y-8 w-full">
                    {currentStep === 1 && (
                      <PersonalInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 2 && (
                      <ContactInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 3 && (
                      <SocialMediaInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 4 && <Confirmation />}
                  </form>
                </FormProvider>
              </div>
            </CardContent>
            <CardFooter className="w-full flex justify-center items-center">
              {currentStep < 4 && (
                <div className="gap-4 flex justify-end w-full md:w-[80%]">
                  {currentStep > 1 && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      Back
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-full"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-full"
                      type="button" // Changed from 'submit' to 'button' to prevent default form submission
                      onClick={validateAndSubmit}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </SkeletonWrapper>
  );
};
