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
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ExtendedProfile } from "../_actions/getAllVerifiedProfiles";
import { ApproveResponse, verifyProfile } from "../_actions/verifyProfile";

const JoinRequestList = ({
  unverifiedProfiles,
}: {
  unverifiedProfiles: ExtendedProfile[];
}) => {
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);

  React.useEffect(() => {
    setProfiles(unverifiedProfiles);
  }, [unverifiedProfiles]);

  const handleApprove = React.useCallback(async (id: string) => {
    if (!id) {
      toast.error("Invalid user id", { autoClose: 1000 });
      return;
    }

    try {
      const response: ApproveResponse = await verifyProfile(id);
      toast.success("Profile approval was successful", {
        autoClose: 1000,
        toastId: "approve",
      });

      setProfiles((prev) =>
        prev.filter((profile) => profile.userId !== response?.data?.clerkUserId)
      );
    } catch (error) {
      toast.error(`Verification failed: ${error}`, {
        autoClose: 1000,
        toastId: "approve",
      });
    }
  }, []);

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
                Only approve members you know were part of the AFSS07 set. If
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
