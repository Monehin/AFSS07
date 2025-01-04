"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDayandMonthDateString } from "@/lib/utils";
import { Profile } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ApproveResponse,
  approveVerificationRequest,
} from "../actions/approveVerificationRequest";
import { getAllVerificationRequest } from "../actions/getAllVerificationRequest";

const JoinRequestList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const mutatation = useMutation<ApproveResponse, Error, string>({
    mutationFn: approveVerificationRequest,
    onSuccess: ({ data }: ApproveResponse) => {
      toast.success("Profile approval was successful", {
        autoClose: 1000,
        toastId: "approve",
      });

      setProfiles((prev) =>
        prev.filter((profile) => profile.userId !== data?.clerkUserId)
      );
    },
    onError: (error) =>
      toast.error(`Verification failed ${error}`, {
        autoClose: 1000,
        toastId: "approve",
      }),
  });

  useEffect(() => {
    (async () => {
      try {
        const profiles = await getAllVerificationRequest();
        if (!profiles?.error && profiles?.data) {
          setProfiles(profiles?.data);
        }
      } catch (error) {
        toast.error(error as string, {
          autoClose: 1000,
        });
      }
    })();
  }, [setProfiles]);

  const handleApprove = React.useCallback(
    async (id: string) => {
      if (!id) {
        toast.error("Invalid user id", { autoClose: 1000 });
        return;
      }
      mutatation.mutateAsync(id);
    },
    [mutatation]
  );

  return (
    <div className="mb-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="font-bold">
              Pending Join Request ({profiles.length})
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableCaption>
                Only approve members you know were part of our 2007 set. If
                unsure, confirm in the WhatsApp group. Thank you!
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Birth Date</TableHead>
                  <TableHead>Career</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Approve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.firstName}</TableCell>
                    <TableCell>{profile.lastName}</TableCell>
                    <TableCell>
                      {profile.dob
                        ? getDayandMonthDateString(profile.dob)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{profile.career || "N/A"}</TableCell>
                    <TableCell>
                      {profile.country || "N/A"}, {profile.state || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleApprove(profile.userId)}
                        className="bg-green-500 text-white"
                        disabled={mutatation.isPending}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default JoinRequestList;
