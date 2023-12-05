import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IGetMessageHistoryResponse } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const getP2PNewMessages = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<IGetMessageHistoryResponse | null> => {
  const targetUserId = queryKey[1];
  const lastFetchDT = queryKey[2];
  const response = await UserService.getP2PNewMessagesSinceDT(
    targetUserId,
    lastFetchDT
  );
  if (response.status === "Error") return null;
  const data: IGetMessageHistoryResponse = response.data;
  return data;
};

const useP2PNewMessages = (
  targetUserId: string | null,
  lastFetchDT: string | null,
  fetchingNewMsg: boolean
): {
  data: IGetMessageHistoryResponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_P2P_NEW_MESSAGES, targetUserId, lastFetchDT],
    getP2PNewMessages,
    {
      enabled: !!targetUserId && !!lastFetchDT && !!fetchingNewMsg,
    }
  );
  return {
    data: data ?? null,
    isError,
    isLoading,
  };
};

export default useP2PNewMessages;
