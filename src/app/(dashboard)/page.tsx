import { getAllUnverifiedProfiles } from "@/app/(dashboard)/home/_actions/getAllUnverifiedProfiles";
import { getAllVerifiedProfiles } from "@/app/(dashboard)/home/_actions/getAllVerifiedProfiles";
import Home from "./home/Home";

const page = async () => {
  const verifiedProfiles = await getAllVerifiedProfiles();
  const unverifiedProfiles = await getAllUnverifiedProfiles();

  if (!verifiedProfiles.data || !unverifiedProfiles.data) {
    return <div>Failed to fetch profiles</div>;
  }

  return (
    <div className="w-[90%]">
      <Home
        verifiedProfiles={verifiedProfiles.data}
        unverifiedProfiles={unverifiedProfiles.data}
      />
    </div>
  );
};

export default page;
