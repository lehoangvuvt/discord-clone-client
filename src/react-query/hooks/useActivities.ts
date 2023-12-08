import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { ActivityVerbEnum, IActivity, IUserInfo } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const getActivities = async (): Promise<
  | {
      [key in ActivityVerbEnum]: IActivity[];
    }
  | null
> => {
  const response = await UserService.getActivities();
  if (response.status === "Error") return null;
  return response.data;
};

const useActivities = (
  userInfo: IUserInfo | null
): {
  activities:
    | {
        [key in ActivityVerbEnum]: IActivity[];
      }
    | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_ACTIVITIES],
    getActivities,
    { enabled: userInfo !== null }
  );
  return {
    activities: data ?? null,
    isError,
    isLoading,
  };
};

export default useActivities;
