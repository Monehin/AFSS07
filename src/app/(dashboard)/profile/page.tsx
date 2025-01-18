"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateProfile } from "@/app/actions/updateProfile";
import { Save, Trash, UploadCloud } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { platformOptions } from "@/utils/platformOptions";
import { SocialIcon } from "react-social-icons";
import LogoIcon from "@/components/LogoIcon";

/* ------------------------------------------------------------------
  Profile Data Interface
------------------------------------------------------------------ */
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

interface SocialMediaLink {
  platform: string;
  url: string;
  id?: string;
  userId?: string;
}

export default function ProfilePageTabs() {
  const router = useRouter();
  const [isPending] = useTransition();

  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
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
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({});

  const [countryIso, setCountryIso] = useState("");
  const [stateIso, setStateIso] = useState("");
  const [cityName, setCityName] = useState("");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
    []
  );

  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"personal" | "location" | "photo">(
    "personal"
  );

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (isPending) return;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data: ProfileData = await res.json();
          setProfile(data);
          setOriginalProfile(data);

          if (data.socialMediaLinks) {
            console.log(data.socialMediaLinks);
            const saveSocialMediaLinks = data.socialMediaLinks.map((link) => {
              return {
                platform: link.platform,
                url: link.url,
                id: link.id,
              };
            });

            setSocialMediaLinks(saveSocialMediaLinks);
          }

          // Initialize location dropdowns
          const fetchedCountry = data.country || "";
          const fetchedState = data.state || "";
          const fetchedCity = data.city || "";

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

              if (myCities.some((c) => c.name === fetchedCity)) {
                setCityName(fetchedCity);
              } else {
                setCityName("");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetchingProfile(false);
      }
    })();
  }, [isPending]);

  useEffect(() => {
    if (!isFetchingProfile) {
      setIsProfileChanged(
        JSON.stringify(profile) !== JSON.stringify(originalProfile)
      );
    }
  }, [profile, originalProfile, isFetchingProfile]);

  const handleChangeCountry = (value: string) => {
    setCountryIso(value);
    const newStates = State.getStatesOfCountry(value);
    setStates(newStates);
    setStateIso("");
    setCities([]);
    setCityName("");
  };

  const handleChangeState = (value: string) => {
    setStateIso(value);
    const newCities = City.getCitiesOfState(countryIso, value);
    setCities(newCities);
    setCityName("");
  };

  const addField = (platformId: string) => {
    setSocialMediaLinks((prevLinks) => [
      ...prevLinks,
      { platform: platformId, url: "" },
    ]);
  };
  const removeField = (platform: string) => {
    setSocialMediaLinks((prevLinks) =>
      prevLinks.filter((link) => link.platform !== platform)
    );
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    setSocialMediaLinks((prevLinks) => {
      const existingIndex = prevLinks.findIndex(
        (link) => link.platform === platform
      );
      if (existingIndex > -1) {
        const updatedLinks = [...prevLinks];
        updatedLinks[existingIndex] = { platform, url };
        return updatedLinks;
      } else {
        return [...prevLinks, { platform, url }];
      }
    });
    setProfile((prev) => ({ ...prev, socialMediaLinks }));
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProfile((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.[0]) return;
    await uploadImage(e.dataTransfer.files[0]);
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
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const finalProfile = {
        ...profile,
        country: countryIso,
        state: stateIso,
        city: cityName,
        socialMediaLinks,
      };

      try {
        const res = await updateProfile(finalProfile);
        if (res.data) {
          toast.success("Profile updated successfully!", { autoClose: 1000 });
          setOriginalProfile(finalProfile);
          router.refresh();
        } else {
          toast.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [profile, countryIso, stateIso, cityName, router, socialMediaLinks]
  );

  if (isPending || isFetchingProfile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

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
                  {/* FIRST NAME */}
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  {/* LAST NAME */}
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
                  {/* CAREER */}
                  <div>
                    <Label htmlFor="career">Career</Label>
                    <Input
                      id="career"
                      name="career"
                      value={profile.career ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  {/* PHONE */}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone ?? ""}
                      onChange={handleChange}
                    />
                  </div>
                  {/* EMAIL */}
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
                    {/* COUNTRY */}
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
                    {/* STATE */}
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
                    {/* CITY */}
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
                    {/* ZIP */}
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

                  {/* Add a button to update/change photo */}
                  <Button variant="outline" onClick={handleFileClick}>
                    Change Photo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className=" m-4 ">
                  <div className="flex flex-col justify-center items-center mb-4">
                    {socialMediaLinks.length <= 4 && (
                      <p className="text-gray-600  font-medium">
                        Select Platforms
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-1 md:gap-8 mb-10 flex-wrap justify-center">
                      {platformOptions.map(({ id, label }) => (
                        <div
                          key={id}
                          className={`flex items-center gap-2 g-x-12 cursor-pointer ${
                            socialMediaLinks.some(
                              (field) => field.platform === id
                            )
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() => addField(id)}
                          aria-label={`Add ${label}`}
                        >
                          <SocialIcon network={id} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 gap-y-6 w-full">
                    {socialMediaLinks.map((field) => {
                      const platform = platformOptions.find(
                        (option) => option.id === field.platform
                      );
                      if (!platform) return null;

                      const { label, color, id } = platform;

                      return (
                        <div
                          key={field.platform}
                          className="flex flex-col items-center gap-4 mb-4 md:mb-6 w-full"
                        >
                          <div className="relative flex w-full items-center gap-2">
                            <span className="text-sm  absolute top-[-20] left-[43]">
                              <a
                                target="_blank"
                                href={`${platform.basePath}${field.url}`}
                                className={`block truncate max-w-[230px] md:max-w-[300px] hover:text-blue-500 ${
                                  field.url.length
                                    ? "text-blue-400"
                                    : " text-gray-400"
                                }`}
                                style={{
                                  pointerEvents: field.url.length
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                {`${platform.basePath}${field.url}`}{" "}
                              </a>
                            </span>
                            <div className="">
                              <div
                                className=" items-center gap-2"
                                style={{ color }}
                              >
                                {id && (
                                  <LogoIcon icon={id} width={40} height={40} />
                                )}
                              </div>
                            </div>
                            <div className="relative  w-full">
                              <Input
                                type="text"
                                placeholder={`Username`}
                                {...field}
                                value={field.url || ""}
                                onChange={(e) => {
                                  handleSocialLinkChange(id, e.target.value);
                                }}
                                className="w-full"
                              />
                            </div>

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
              disabled={!isProfileChanged}
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
