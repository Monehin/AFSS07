import { useQuery } from "@tanstack/react-query";
import { ProfileType } from "@/utils/types";
import { getProfiles } from "@/app/(dashboard)/home/_actions/getProfiles";
import { ExtendedProfile } from "@/app/(dashboard)/home/_actions/getAllVerifiedProfiles";

export const useGetUserProfile = () => {
  const { data, error, isLoading } = useQuery<ProfileType>({
    queryKey: ["userProfile"],
    queryFn: () =>
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => data as ProfileType),
  });

  return { data, error, isLoading };
};

export const useGetAllProfile = () => {
  const { data, error, isLoading } = useQuery<ExtendedProfile[]>({
    queryKey: ["allProfiles"],
    queryFn: async () => {
      const result = await getProfiles();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  return { data, error, isLoading };
};
