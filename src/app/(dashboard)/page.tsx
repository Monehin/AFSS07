import { getAllUnverifiedProfiles } from "@/app/(dashboard)/home/_actions/getAllUnverifiedProfiles";
import { getAllVerifiedProfiles } from "@/app/(dashboard)/home/_actions/getAllVerifiedProfiles";
import Home from "./home/Home";
import { getProfile } from "../actions/getProfile";

const page = async () => {
  const verifiedProfiles = await getAllVerifiedProfiles();
  const unverifiedProfiles = await getAllUnverifiedProfiles();
  const userProfile = await getProfile();

  if (userProfile.error) {
    return null;
  }
  if (!verifiedProfiles.data || !unverifiedProfiles.data) {
    return null;
  }

  return (
    <div className="w-[90%]">
      <Home
        userProfile={userProfile.data}
        verifiedProfiles={verifiedProfiles.data}
        unverifiedProfiles={unverifiedProfiles.data}
      />
    </div>
  );
};

export default page;
