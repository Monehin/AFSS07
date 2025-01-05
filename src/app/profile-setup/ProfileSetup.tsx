"use client";
import { createProfile } from "@/app/profile-setup/_actions/createProfile";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddressInfo from "../../components/Forms/AddressInfo";
import CareerInfo from "../../components/Forms/CareerInfo";
import Confirmation from "../../components/Forms/Confirmation";
import PersonalInfo from "../../components/Forms/PersonalInfo";
import { FormValues, formSchema } from "../../components/Forms/ProfileSchema";
import { UserWithProfile } from "../api/user/route";

export const ProfileSetup = ({ userId }: { userId: string }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const userProfile = useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserWithProfile> => {
      const response = await fetch("/api/user");

      return response.json();
    },
  });

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
    <SkeletonWrapper isLoading={isLoading} className="h-[225px] w-full">
      <div className="flex flex-col items-center justify-center gap-y-6 w-full">
        <div className="w-full">
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
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-center">
                  {currentStep === 1
                    ? "Tell us about yourself"
                    : currentStep === 2
                    ? "What do you do to pay the bills (or fund your dreams)"
                    : currentStep === 3
                    ? "Where on this beautiful planet do you call home?"
                    : "Request approval from a member of the community"}
                </div>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center">
                <FormProvider {...methods}>
                  <form className="space-y-8 w-full">
                    {currentStep === 1 && (
                      <PersonalInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 2 && (
                      <CareerInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 3 && (
                      <AddressInfo clearErrors={clearErrors} />
                    )}
                    {currentStep === 4 && <Confirmation />}
                  </form>
                </FormProvider>
              </div>
            </CardContent>
            <CardFooter>
              {currentStep < 4 && (
                <div className="gap-4  flex justify-end  w-full">
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
                      type="submit"
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
