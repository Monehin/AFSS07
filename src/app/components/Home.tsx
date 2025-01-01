// pages/Home.tsx or wherever your Home component is located
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
import { Profile } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllProfile } from "../actions";
import SearchBar from "./SearchBar";
import SocialMediaList from "./SocialMediaList";

const Home = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        console.log("Fetching profiles");
        const profiles = await getAllProfile();
        if (!profiles?.error && profiles?.data) {
          console.log(profiles?.data);
          setProfiles(profiles?.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // Function to handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getDayandMonthDateString = (dob: Date | null) => {
    if (!dob) return "";
    const date = new Date(dob);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    return `${day} ${month}`;
  };

  // Function to filter profiles based on search query
  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase();

    if (!profile.firstName || !profile.lastName) return false;
    return (
      profile.firstName.toLowerCase().includes(query) ||
      profile.lastName.toLowerCase().includes(query) ||
      (profile.dob &&
        getDayandMonthDateString(profile.dob).toLowerCase().includes(query)) ||
      (profile.career && profile.career.toLowerCase().includes(query)) ||
      (profile.country && profile.country.toLowerCase().includes(query)) ||
      (profile.state && profile.state.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      <div className="flex flex-col md:justify-center md:items-center">
        <p className="md:text-2xl sm:text-xl  font-bold  mt-4">
          AirForce Secondary School Ikeja Class of 2007
        </p>
        <p className="md:text-base sm:text-sm text-gray-500">
          Here you can find information about your classmates.
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
          {filteredProfiles.map((profile) => {
            return (
              <TableRow key={profile.id}>
                <TableCell>{profile.firstName}</TableCell>
                <TableCell>{profile.lastName}</TableCell>
                <TableCell>{getDayandMonthDateString(profile.dob)}</TableCell>
                <TableCell>{profile.career}</TableCell>
                <TableCell>
                  {profile.country}, {profile.state}
                </TableCell>
                <TableCell>
                  <SocialMediaList
                    socialMediaLinks={profile.socialMediaLinks as any}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Home;
