import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IGetUserPendingRequestsReponse } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const getPendingRequests =
  async (): Promise<IGetUserPendingRequestsReponse | null> => {
    const response = await UserService.getUserPendingRequests();
    if (response.status === "Error") return null;
    return response.data;
  };

const usePendingRequests = (): {
  pendingRequests: IGetUserPendingRequestsReponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_PENDING_REQUESTS],
    getPendingRequests
  );
  return {
    pendingRequests: data ?? null,
    isError,
    isLoading,
  };
};

export default usePendingRequests;
