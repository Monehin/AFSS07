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
import { getDayandMonthDateString } from "@/lib/utils";
import { Profile, SocialMediaLink } from "@prisma/client";
import debounce from "debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import JoinRequestList from "./components/JoinRequestList";
import SearchBar from "./components/SearchBar";
import SocialMediaList from "./components/SocialMediaList";

interface ExtendedProfile extends Profile {
  socialMediaLinks?: SocialMediaLink[];
}

interface ProfilesState {
  verifiedProfiles: ExtendedProfile[];
  unverifiedProfiles: ExtendedProfile[];
}

const Home = ({
  verifiedProfiles,
  unverifiedProfiles,
}: {
  verifiedProfiles: ExtendedProfile[];
  unverifiedProfiles: ExtendedProfile[];
}) => {
  const [profiles, setProfiles] = useState<ProfilesState>({
    verifiedProfiles: [],
    unverifiedProfiles: [],
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setProfiles({ verifiedProfiles, unverifiedProfiles });
  }, [verifiedProfiles, unverifiedProfiles]);

  const debouncedSearch = useRef(
    debounce((query: string) => setSearchQuery(query), 300)
  ).current;

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const filteredProfiles = useMemo(
    () =>
      profiles.verifiedProfiles.filter((profile: ExtendedProfile) => {
        const query = searchQuery.toLowerCase();
        return (
          (profile.firstName &&
            profile.firstName.toLowerCase().includes(query)) ||
          (profile.lastName &&
            profile.lastName.toLowerCase().includes(query)) ||
          (profile.dob &&
            getDayandMonthDateString(profile.dob)
              .toLowerCase()
              .includes(query)) ||
          (profile.career && profile.career.toLowerCase().includes(query)) ||
          (profile.country && profile.country.toLowerCase().includes(query)) ||
          (profile.state && profile.state.toLowerCase().includes(query))
        );
      }),
    [profiles, searchQuery]
  );

  return (
    <div>
      <div className="my-6">
        <JoinRequestList unverifiedProfiles={profiles.unverifiedProfiles} />
      </div>
      <div className="flex flex-col md:justify-center md:items-center">
        <p className="md:text-2xl sm:text-xl font-bold mt-4">
          AirForce Secondary School Ikeja Class of 2007
        </p>
        <p className="md:text-lg font-bold sm:text-sm text-gray-500">
          We currently have {profiles.verifiedProfiles.length} members on the
          platform
        </p>
        <div className="md:w-2/4 mt-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <Table>
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
          {filteredProfiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.firstName}</TableCell>
              <TableCell>{profile.lastName}</TableCell>
              <TableCell>{getDayandMonthDateString(profile.dob)}</TableCell>
              <TableCell>{profile.career}</TableCell>
              <TableCell>
                {profile.country}, {profile.state}
              </TableCell>
              <TableCell>
                {profile.socialMediaLinks ? (
                  <SocialMediaList
                    socialMediaLinks={profile.socialMediaLinks}
                  />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
