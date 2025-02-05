"use client";

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
import debounce from "debounce";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import JoinRequestList from "./components/JoinRequestList";
import SearchBar from "./components/SearchBar";
import SocialMediaList from "./components/SocialMediaList";
import { useGetAllProfile, useGetUserProfile } from "@/hooks/useQuery";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

interface ExtendedProfile extends Profile {
  socialMediaLinks?: SocialMediaLink[];
  user?: User;
}
const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [verifiedProfiles, setVerifiedProfiles] = useState<ExtendedProfile[]>(
    []
  );
  const [unverifiedProfiles, setUnverifiedProfiles] = useState<
    ExtendedProfile[]
  >([]);
  const currentUserProfile = useGetUserProfile();
  const allProfiles = useGetAllProfile();

  const {
    data: userProfile,
    error: userProfileError,
    isLoading: isLoadingUserProfile,
  } = currentUserProfile;
  const {
    data: allProfilesData,
    error: allProfilesError,
    isLoading: isLoadingAllProfiles,
  } = allProfiles;

  useEffect(() => {
    if (userProfileError || allProfilesError) {
      toast.error(
        userProfileError?.message ||
          allProfilesError?.message ||
          "An error occurred"
      );
    }
    if (allProfilesData) {
      const verified = allProfilesData
        .filter((profile) => profile.user?.verified)
        .sort((a, b) => {
          if (a.firstName && b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
          return 0;
        });
      const unverified = allProfilesData
        .filter((profile) => !profile.user?.verified)
        .sort((a, b) => {
          if (a.firstName && b.firstName) {
            return a.firstName.localeCompare(b.firstName);
          }
          return 0;
        });
      setVerifiedProfiles(verified);
      setUnverifiedProfiles(unverified);
    }
  }, [allProfilesData, userProfileError, allProfilesError]);

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

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return verifiedProfiles;

    return verifiedProfiles.filter((profile) =>
      [
        profile.firstName,
        profile.lastName,
        profile.career,
        getCountryName(profile.country || ""),
        profile.state,
        profile.dob ? getDayandMonthDateString(profile.dob) : "",
      ]
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(query))
    );
  }, [verifiedProfiles, searchQuery]);

  if (isLoadingUserProfile || isLoadingAllProfiles) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ClipLoader color="#10B981" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 mx-4 md:mx-20">
      {" "}
      {userProfile?.firstName ? (
        <h1 className="text-2xl font-bold">
          Welcome, {userProfile.firstName} 👋
        </h1>
      ) : null}
      {userProfile?.user?.role === "ADMIN" && unverifiedProfiles.length > 0 && (
        <div className="mb-8">
          <JoinRequestList unverifiedProfiles={unverifiedProfiles} />
        </div>
      )}
      {/* Header */}
      <div className="">
        <p className="text-base  font-bold">AFSS07 Members </p>
        <p className="text-sm sm:text-base text-gray-500">
          {verifiedProfiles.length} members
        </p>
      </div>
      <div className="max-w-md mb-4 flex flex-col items-center gap-2">
        <div className="w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      {/* Mobile/Tablet Profiles in grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
      {/* Desktop View */}
      <ProfileTable profiles={filteredProfiles} />
    </div>
  );
};

export default Home;

/** ProfileCard Component */
const ProfileCard = ({ profile }: { profile: ExtendedProfile }) => {
  const fullName = `${profile.firstName || "First Name"} ${
    profile.lastName || "Last Name"
  }`;

  const MAX_LENGTH = 20;
  const isLongName = fullName.length > MAX_LENGTH;

  return (
    <div className="relative max-w-md overflow-hidden rounded-md shadow-sm bg-white md:hidden block">
      {/* Background illustration/pattern on the left side */}
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
        {/* Left (2/3) - Profile Info Section */}
        <div className="p-4 w-2/3 space-y-2 relative z-10">
          <div className="flex items-center space-x-3">
            {profile.user?.imageUrl ? (
              <Image
                src={
                  profile.imageUrl ? profile.imageUrl : profile.user.imageUrl
                }
                alt={`${profile.firstName} ${profile.lastName}`}
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
              {profile.city && `, ${profile.city}`}
            </p>
          </div>
        </div>

        {/* Right (1/3) - Additional Info / Social Links */}
        <div className="w-1/3 p-4 bg-gray-50 flex flex-col items-end justify-between relative z-10 space-y-2">
          {profile.socialMediaLinks && profile.socialMediaLinks.length > 0 ? (
            <div>
              <SocialMediaList socialMediaLinks={profile.socialMediaLinks} />
            </div>
          ) : (
            <p className="text-xs text-gray-400">No social media</p>
          )}
        </div>
      </div>
    </div>
  );
};

/** ProfileTable Component (for Desktop View) */
const ProfileTable = ({ profiles }: { profiles: ExtendedProfile[] }) => {
  return (
    <Table className="hidden md:table">
      <TableCaption>
        Members of the AirForce Secondary School Ikeja Class of 2007
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Birth Date</TableHead>
          <TableHead>Career</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Social Media</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.firstName}</TableCell>
            <TableCell>{profile.lastName}</TableCell>
            <TableCell>
              {profile.dob ? getDayandMonthDateString(profile.dob) : "N/A"}
            </TableCell>
            <TableCell>{profile.career || "Not specified"}</TableCell>
            <TableCell>
              {getCountryName(profile.country) || "Country not specified"}
              {profile.city && `, ${profile.city}`}
            </TableCell>
            <TableCell>
              {profile.socialMediaLinks && (
                <SocialMediaList socialMediaLinks={profile.socialMediaLinks} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
