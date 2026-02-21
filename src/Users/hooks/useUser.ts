import { useQuery } from "@tanstack/react-query";
import { mapUser } from "src/Users/utils/mapUser";
import { pb } from "src/pocketbase/utils/connection";
import type { User } from "src/Users/User.type";

export const useUser = () => {
  const queryFn = async (): Promise<User | null> => {
    if (pb.authStore?.record) {
      return mapUser(pb.authStore.record);
    }

    return null;
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["authentication.user"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    user: data ?? null,
    userLoading: isPending,
    userError: isError,
  };
};
