"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateProfile } from "@/app/actions/updateProfile";
import { Save, Trash, UploadCloud } from "lucide-react";

// country-state-city
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

// shadcn/ui
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { toast } from "react-toastify";
import { platformOptions } from "@/utils/platformOptions";
import { SocialIcon } from "react-social-icons";
import LogoIcon from "@/components/LogoIcon";

/* ------------------------------------------------------------------
  Types & Interfaces
------------------------------------------------------------------ */
interface SocialMediaLink {
  platform: string;
  url: string;
  id?: string;
  userId?: string;
}

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
  socialMediaLinks?: SocialMediaLink[];
}

/* ------------------------------------------------------------------
  Helper Function for Deep Comparison
------------------------------------------------------------------ */
function profilesAreDifferent(a: ProfileData, b: ProfileData) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

/* ------------------------------------------------------------------
  Main Component
------------------------------------------------------------------ */
export default function ProfilePageTabs() {
  const router = useRouter();
  const [isPending] = useTransition();

  /* ------------------------------------------------------------------
    Loading / Fetch States
  ------------------------------------------------------------------ */
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  /* ------------------------------------------------------------------
    Profile States
  ------------------------------------------------------------------ */
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
    socialMediaLinks: [],
  });

  // The "saved" state we compare against.
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({});

  // Track if anything has changed
  const [isDirty, setIsDirty] = useState(false);

  /* ------------------------------------------------------------------
    Location States
  ------------------------------------------------------------------ */
  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");
  const [cityName, setCityName] = useState("");

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  /* ------------------------------------------------------------------
    UI States
  ------------------------------------------------------------------ */
  const [activeTab, setActiveTab] = useState<
    "personal" | "location" | "photo" | "social"
  >("personal");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------
    Fetch Countries on Mount
  ------------------------------------------------------------------ */
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  /* ------------------------------------------------------------------
    Fetch & Set Profile
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (isPending) return;

    const fetchProfile = async () => {
      try {
        setIsFetchingProfile(true);
        const res = await fetch("/api/profile");
        if (!res.ok) {
          console.error("Failed to fetch profile:", res.statusText);
          toast.error("Failed to fetch profile.");
          return;
        }
        const data: ProfileData = await res.json();

        // Store both 'profile' and 'originalProfile'
        setProfile(data);
        setOriginalProfile(data);

        // Social Media Links are part of profile now, no separate state needed

        // Location
        const fetchedCountry = data.country || "";
        const fetchedState = data.state || "";
        const fetchedCity = data.city || "";

        setCountryIso(fetchedCountry);

        if (fetchedCountry) {
          const loadedStates = State.getStatesOfCountry(fetchedCountry);
          setStates(loadedStates);

          setStateIso(fetchedState);

          if (fetchedState) {
            const loadedCities = City.getCitiesOfState(
              fetchedCountry,
              fetchedState
            );
            setCities(loadedCities);

            if (loadedCities.some((c) => c.name === fetchedCity)) {
              setCityName(fetchedCity);
            } else {
              setCityName("");
              // Optionally, reset city in profile if it doesn't exist
              setProfile((prev) => ({ ...prev, city: "" }));
            }
          } else {
            setProfile((prev) => ({ ...prev, state: "", city: "" }));
          }
        } else {
          setStates([]);
          setCities([]);
          setCityName("");
          setProfile((prev) => ({ ...prev, country: "", state: "", city: "" }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("An error occurred while fetching your profile.");
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [isPending]);

  /* ------------------------------------------------------------------
    Compare Profile and Original to Set Dirty State
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isFetchingProfile) {
      const changed = profilesAreDifferent(profile, originalProfile);
      setIsDirty(changed);
      console.log("isDirty set to:", changed);
    }
  }, [profile, originalProfile, isFetchingProfile]);

  /* ------------------------------------------------------------------
    Handlers
  ------------------------------------------------------------------ */
  // Reusable input handler for text fields
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  /* -----------------------------
      Location Select
  ----------------------------- */
  const handleChangeCountry = (value: string) => {
    setCountryIso(value);
    const newStates = State.getStatesOfCountry(value);
    setStates(newStates);
    setStateIso("");
    setCities([]);
    setCityName("");

    // Update profile's location fields
    setProfile((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
    }));
  };

  const handleChangeState = (value: string) => {
    setStateIso(value);
    const newCities = City.getCitiesOfState(countryIso, value);
    setCities(newCities);
    setCityName("");

    setProfile((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));
  };

  const handleChangeCity = (value: string) => {
    setCityName(value);
    setProfile((prev) => ({
      ...prev,
      city: value,
    }));
  };

  /* -----------------------------
      File / Image Upload
  ----------------------------- */
  const handleFileClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await uploadImage(file);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
  };

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
      toast.success("Image uploaded successfully!", { autoClose: 1000 });
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
    }
  };

  /* -----------------------------
      Social Media
  ----------------------------- */
  const addField = (platformId: string) => {
    setProfile((prev) => ({
      ...prev,
      socialMediaLinks: [
        ...(prev.socialMediaLinks || []),
        { platform: platformId, url: "" },
      ],
    }));
    console.log(`Added social media platform: ${platformId}`);
  };

  const removeField = (platformId: string) => {
    setProfile((prev) => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks?.filter(
        (link) => link.platform !== platformId
      ),
    }));
    console.log(`Removed social media platform: ${platformId}`);
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    setProfile((prev) => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks?.map((link) =>
        link.platform === platform ? { ...link, url } : link
      ),
    }));
    console.log(`Updated social link: ${platform} -> ${url}`);
  };

  /* ------------------------------------------------------------------
    Submit Handler
  ------------------------------------------------------------------ */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Consolidate final data
      const finalProfile: ProfileData = {
        ...profile,
        country: countryIso,
        state: stateIso,
        city: cityName,
        // socialMediaLinks is already part of profile
      };

      console.log("Submitting Profile:", finalProfile);

      try {
        const res = await updateProfile(finalProfile);
        console.log("Update Profile Response:", res);
        if (res.data) {
          toast.success("Profile updated successfully!", { autoClose: 1000 });

          // Reset originalProfile to the new "saved" data
          setOriginalProfile(finalProfile);

          // This ensures the button immediately disables
          setIsDirty(false);

          // Optionally refresh if desired
          router.refresh();
        } else {
          toast.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("An error occurred while updating your profile.");
      }
    },
    [profile, countryIso, stateIso, cityName, router]
  );

  /* ------------------------------------------------------------------
    Conditional Loading
  ------------------------------------------------------------------ */
  if (isPending || isFetchingProfile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
    Render
  ------------------------------------------------------------------ */
  return (
    <div className="mx-auto w-full sm:w-[90%] md:w-[50%] p-4">
      <Card className="border rounded shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profile Details
          </CardTitle>
          <CardDescription>
            Update your details and click <b>save</b> to apply changes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as typeof activeTab)}
            >
              <TabsList className="flex space-x-2">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="photo">Photo</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

              <Separator className="my-4" />

              {/* PERSONAL TAB */}
              <TabsContent value="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName ?? ""}
                      onChange={handleChange}
                    />
                  </div>
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
                  <div>
                    <Label htmlFor="career">Career</Label>
                    <Input
                      id="career"
                      name="career"
                      value={profile.career ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone ?? ""}
                      onChange={handleChange}
                    />
                  </div>
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
                </div>
              </TabsContent>

              {/* LOCATION TAB */}
              <TabsContent value="location">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={profile.address ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={cityName}
                        onValueChange={handleChangeCity}
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
                </div>
              </TabsContent>

              {/* PHOTO TAB */}
              <TabsContent value="photo">
                <div className="space-y-4">
                  <Label className="block font-semibold">Profile Photo</Label>
                  <div
                    className={`relative w-32 h-32 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center border border-dashed transition-colors cursor-pointer ${
                      isDragging ? "border-black" : "border-gray-300"
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
                        className="object-cover w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm flex flex-col items-center">
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

                  <Button variant="outline" onClick={handleFileClick}>
                    Change Photo
                  </Button>
                </div>
              </TabsContent>

              {/* SOCIAL TAB */}
              <TabsContent value="social">
                <div className="m-4">
                  <div className="flex flex-col justify-center items-center mb-4">
                    {profile.socialMediaLinks &&
                      profile.socialMediaLinks?.length < 5 && (
                        <p className="text-gray-600 font-medium">
                          Select Platforms
                        </p>
                      )}
                  </div>

                  <div className="flex gap-1 md:gap-8 mb-10 flex-wrap justify-center">
                    {platformOptions.map(({ id, label }) => {
                      const isAlreadyAdded = profile.socialMediaLinks?.some(
                        (link) => link.platform === id
                      );
                      if (isAlreadyAdded) return null;

                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => addField(id)}
                          aria-label={`Add ${label}`}
                        >
                          <SocialIcon network={id} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center gap-2 gap-y-6 w-full">
                    {profile.socialMediaLinks?.map((field) => {
                      const platformObj = platformOptions.find(
                        (option) => option.id === field.platform
                      );
                      if (!platformObj) return null;

                      const { label, color, id, basePath } = platformObj;
                      return (
                        <div
                          key={field.platform}
                          className="flex flex-col items-center gap-4 mb-4 md:mb-6 w-full md:max-w-[42rem] lg:max-w-[30rem]"
                        >
                          <div className="relative flex w-full items-center gap-2 ">
                            {/* Link Preview */}
                            <div className="text-sm absolute top-[-20px] left-[43px]">
                              {field.url ? (
                                <a
                                  target="_blank"
                                  href={`${basePath}${field.url}`}
                                  className={`block truncate max-w-[230px] md:max-w-[300px] hover:text-blue-500 ${
                                    field.url
                                      ? "text-blue-400"
                                      : "text-gray-400"
                                  }`}
                                  style={{
                                    pointerEvents: field.url ? "auto" : "none",
                                  }}
                                >
                                  {`${basePath}${field.url}`}
                                </a>
                              ) : (
                                <span className="text-gray-400">
                                  No URL Provided
                                </span>
                              )}
                            </div>

                            {/* Platform Icon */}
                            <div style={{ color }}>
                              {id && (
                                <LogoIcon icon={id} width={40} height={40} />
                              )}
                            </div>

                            {/* Username Input */}
                            <div className="relative w-full">
                              <Input
                                type="text"
                                placeholder="Username"
                                value={field.url || ""}
                                onChange={(e) =>
                                  handleSocialLinkChange(id, e.target.value)
                                }
                                className="w-full"
                              />
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="outline"
                              className="ml-auto"
                              onClick={() => removeField(id)}
                              aria-label={`Remove ${label}`}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              // Disable if nothing is dirty OR if we haven't finished fetching
              disabled={!isDirty || isFetchingProfile}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
