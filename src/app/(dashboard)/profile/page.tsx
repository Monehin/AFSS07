"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import { updateProfile } from "@/app/actions/updateProfile";
import { Save, UploadCloud } from "lucide-react";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

interface ProfileData {
  firstName?: string | null;
  lastName?: string | null;
  dob?: string | null;
  phone?: string | null;
  email?: string | null;
  career?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  imageUrl?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  // Complete profile data
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    career: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    imageUrl: "",
  });
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({});

  // For location dropdowns
  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");
  const [cityName, setCityName] = useState("");

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [isProfileChanged, setIsProfileChanged] = useState(false);

  // Drag & drop for image
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load list of countries once
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Fetch the user profile
  useEffect(() => {
    if (!isLoaded || !user) return;

    (async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET" });
        if (res.ok) {
          const data: ProfileData = await res.json();

          setProfile(data);
          setOriginalProfile(data);

          const fetchedCountry = data.country || "";
          const fetchedState = data.state || "";
          const fetchedCity = data.city || "";

          // Set the country
          setCountryIso(fetchedCountry);
          if (fetchedCountry) {
            const myStates = State.getStatesOfCountry(fetchedCountry);
            setStates(myStates);

            setStateIso(fetchedState);
            if (fetchedState) {
              const myCities = City.getCitiesOfState(
                fetchedCountry,
                fetchedState
              );
              setCities(myCities);

              // If the city from the server is valid, set it
              if (myCities.some((c) => c.name === fetchedCity)) {
                setCityName(fetchedCity);
              } else {
                setCityName("");
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsFetchingProfile(false);
      }
    })();
  }, [isLoaded, user]);

  // When the user changes country from the dropdown
  const handleChangeCountry = (value: string) => {
    setCountryIso(value);
    const newStates = State.getStatesOfCountry(value);
    setStates(newStates);
    setStateIso("");
    setCities([]);
    setCityName("");
  };

  // When the user changes state from the dropdown
  const handleChangeState = (value: string) => {
    setStateIso(value);
    const newCities = City.getCitiesOfState(countryIso, value);
    setCities(newCities);
    setCityName("");
  };

  // Compare if profile has changed
  useEffect(() => {
    if (!isFetchingProfile) {
      setIsProfileChanged(
        JSON.stringify(profile) !== JSON.stringify(originalProfile)
      );
    }
  }, [profile, originalProfile, isFetchingProfile]);

  // Handlers for form inputs
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Submit the profile update
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const finalProfile = {
        ...profile,
        country: countryIso,
        state: stateIso,
        city: cityName,
      };

      try {
        const res = await updateProfile(finalProfile);
        if (res.data) {
          toast.success("Profile updated successfully!", {
            autoClose: 1000,
          });
          setOriginalProfile(finalProfile);
          router.refresh();
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [profile, countryIso, stateIso, cityName, router]
  );

  // File input handlers
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!e.dataTransfer.files?.[0]) return;
    const file = e.dataTransfer.files[0];
    await uploadImage(file);
  }, []);

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image.");

      const data = await res.json();
      setProfile((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadImage(file);
    },
    []
  );

  // If we’re still loading user data or the profile from server
  if (!isLoaded || isFetchingProfile) {
    return (
      <div className="p-4">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Main render
  return (
    <SignedIn>
      <div className="container mx-auto py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">My Profile</CardTitle>
            <CardDescription>
              Update your personal details, upload an avatar, and more.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <Label className="block font-semibold">Profile Image</Label>
                <div
                  className={`relative w-32 h-32 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center border border-dashed hover:border-solid transition-colors cursor-pointer ${
                    isDragging ? "border-blue-500" : "border-gray-300"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={handleFileClick}
                >
                  {profile.imageUrl ? (
                    <Image
                      src={profile.imageUrl}
                      alt="Profile Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center text-sm">
                      <UploadCloud className="h-6 w-6 mb-1" />
                      Drag or Click
                    </div>
                  )}
                </div>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <Separator />

              {/* BASIC PROFILE FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={profile.firstName ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={profile.lastName ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* DOB */}
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dob"
                    name="dob"
                    value={profile.dob?.slice(0, 10) ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Career */}
                <div>
                  <Label htmlFor="career">Career</Label>
                  <Input
                    id="career"
                    name="career"
                    value={profile.career ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profile.phone ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={profile.address ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Country (dropdown) */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={countryIso}
                    onValueChange={handleChangeCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.isoCode} value={c.isoCode}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State (dropdown) */}
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={stateIso}
                    onValueChange={handleChangeState}
                    disabled={!states.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((st) => (
                        <SelectItem key={st.isoCode} value={st.isoCode}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City (dropdown) */}
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={cityName}
                    onValueChange={(value) => {
                      setCityName(value);
                      setProfile((prev) => ({ ...prev, city: value }));
                    }}
                    disabled={!cities.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Zip */}
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={profile.zip ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="flex items-center"
                disabled={isFetchingProfile || !isProfileChanged}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </SignedIn>
  );
}
