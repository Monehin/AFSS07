"use client";

import debounce from "debounce";
import { useCallback, useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCountryName, getDayandMonthDateString } from "@/lib/utils";
import { Profile, SocialMediaLink, User } from "@prisma/client";
import { Check } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { ApproveResponse, verifyProfile } from "../_actions/verifyProfile";
import SearchBar from "./SearchBar";
import SocialMediaList from "./SocialMediaList";

const handleApprove = async (id: string) => {
  if (!id) {
    toast.error("Invalid user id", { autoClose: 1000 });
    return;
  }

  try {
    const response: ApproveResponse = await verifyProfile(id);

    if (response.error) {
      throw new Error(response.error);
    }
    toast.success("Profile approval was successful", {
      autoClose: 1000,
    });
  } catch (error) {
    toast.error(`Verification failed: ${error}`, {
      autoClose: 1000,
    });
  }
};

interface ExtendedProfile extends Profile {
  socialMediaLinks?: SocialMediaLink[];
  user?: User;
}

interface JoinRequestListProps {
  unverifiedProfiles: ExtendedProfile[];
}

/** Card for Mobile/Tablet */
function JoinRequestCard({ profile }: { profile: ExtendedProfile }) {
  const fullName = `${profile.firstName || "First Name"} ${
    profile.lastName || "Last Name"
  }`;

  const MAX_LENGTH = 20;
  const isLongName = fullName.length > MAX_LENGTH;

  return (
    <div className="relative max-w-md overflow-hidden rounded-md shadow-sm bg-white">
      {/* Background illustration/pattern */}
      <div
        className="
          absolute
          inset-0
          w-1/3
          bg-cover
          bg-center
          bg-[url('/path/to/your-image.jpg')]
          opacity-30
          pointer-events-none
        "
      />

      <div className="flex">
        {/* Left (2/3) - Profile Info */}
        <div className="p-4 w-2/3 space-y-2 relative z-10">
          <div className="flex items-center space-x-3">
            {profile.user?.imageUrl ? (
              <Image
                src={
                  profile.imageUrl ? profile.imageUrl : profile.user.imageUrl
                }
                alt={fullName}
                width={200}
                height={200}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-400">No Image</span>
              </div>
            )}
            <div>
              <p
                className={`text-sm font-semibold text-gray-800 ${
                  isLongName ? "line-clamp-2" : ""
                }`}
              >
                {fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile.dob ? getDayandMonthDateString(profile.dob) : "N/A"}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Career:</span>{" "}
              {profile.career || "Not specified"}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {getCountryName(profile.country) || "Country not specified"}
            </p>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-50 flex flex-col items-end justify-between relative z-10 space-y-2">
          {profile.socialMediaLinks && profile.socialMediaLinks.length > 0 ? (
            <div>
              <SocialMediaList socialMediaLinks={profile.socialMediaLinks} />
            </div>
          ) : (
            <p className="text-xs text-gray-400">No social media</p>
          )}

          <div>
            <button
              onClick={() => handleApprove(profile.userId)}
              aria-label="Approve join request"
              className="
                flex items-center gap-1
                px-2 py-1
                text-xs text-white
                bg-green-600 hover:bg-green-700
                transition-colors
                rounded-md
                shadow
              "
            >
              <Check className="h-4 w-4" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Table for Desktop */
function JoinRequestTable({ profiles }: { profiles: ExtendedProfile[] }) {
  return (
    <Table className="hidden md:table">
      <TableCaption>
        {profiles.length > 0
          ? `Approve only those you know were part of our 2007 class. If uncertain, please verify via the WhatsApp group.`
          : "There are no requests to approve"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Birth Date</TableHead>
          <TableHead>Career</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Social Media</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => {
          const fullName = `${profile.firstName || ""} ${
            profile.lastName || ""
          }`;
          return (
            <TableRow key={profile.id}>
              <TableCell>{profile.firstName || "N/A"}</TableCell>
              <TableCell>{profile.lastName || "N/A"}</TableCell>
              <TableCell>
                {profile.dob ? getDayandMonthDateString(profile.dob) : "N/A"}
              </TableCell>
              <TableCell>{profile.career || "Not specified"}</TableCell>
              <TableCell>
                {getCountryName(profile.country) || "Country not specified"}
              </TableCell>
              <TableCell>
                {profile.socialMediaLinks &&
                profile.socialMediaLinks.length > 0 ? (
                  <SocialMediaList
                    socialMediaLinks={profile.socialMediaLinks}
                  />
                ) : (
                  <span className="text-xs text-gray-400">No social media</span>
                )}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleApprove(profile.userId)}
                  aria-label={`Approve join request for ${fullName}`}
                  className="
                    flex items-center gap-1
                    px-2 py-1
                    text-xs text-white
                    bg-green-600 hover:bg-green-700
                    transition-colors
                    rounded-md
                    shadow
                  "
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function JoinRequestList({
  unverifiedProfiles,
}: JoinRequestListProps) {
  /** Search-related state */
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search to reduce rapid re-renders
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  /** Filter unverified profiles by search */
  const filteredProfiles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return unverifiedProfiles;

    return unverifiedProfiles.filter((profile) =>
      [
        profile.firstName,
        profile.lastName,
        profile.career,
        getCountryName(profile.country),
        profile.dob ? getDayandMonthDateString(profile.dob) : "",
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(query))
    );
  }, [unverifiedProfiles, searchQuery]);

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-2"
      disabled={unverifiedProfiles.length === 0}
    >
      <AccordionItem value="joinRequests">
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full no-underline">
            <h2 className="text-base sm:text-base font-semibold">
              New Members
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">
              {unverifiedProfiles.length} unverified
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {/* Subtitle / Summary */}
          <p className="text-sm text-gray-500 mb-4">
            Approve or review new join requests below.
          </p>

          {/* Search Bar & Clear Button */}
          <div className="max-w-md mb-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
            {filteredProfiles.map((profile) => (
              <JoinRequestCard key={profile.id} profile={profile} />
            ))}
          </div>

          {/* Desktop Table */}
          <JoinRequestTable profiles={filteredProfiles} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
