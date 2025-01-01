"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  approveVerificationRequest,
  getAllVerificationRequest,
} from "../actions";

const JoinRequestList: React.FC<{}> = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching profiles");
        const profiles = await getAllVerificationRequest();
        if (!profiles?.error && profiles?.data) {
          setProfiles(profiles?.data);
        }
      } catch (error) {
        toast.error("An error occurred while fetching profiles.", {
          autoClose: 1000,
        });
      }
    })();
  }, [setProfiles]);

  const handleApprove = async (id: string) => {
    try {
      const response = await approveVerificationRequest(id);

      if (response.error) {
        console.error(response.error);
        toast.error(
          "You're not authorized to approve this profile. Contact the admin for help."
        );
      } else {
        toast.success("Profile updated successfully", { autoClose: 1000 });
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while approving the profile.", {
        autoClose: 1000,
      });
    }
  };

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
