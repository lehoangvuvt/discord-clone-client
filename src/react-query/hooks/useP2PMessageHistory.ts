import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IGetMessageHistoryResponse } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const getP2PMessageHistory = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<IGetMessageHistoryResponse | null> => {
  const targetUserId = queryKey[1];
  const page = queryKey[2];
  const limit = queryKey[3];
  const response = await UserService.getP2PMessageHistory(
    targetUserId,
    page,
    limit
  );
  if (response.status === "Error") return null;
  return response.data;
};

const useP2PMessageHistory = (
  targetUserId: string | null,
  page: number,
  limit: number
): {
  data: IGetMessageHistoryResponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_P2P_MESSAGE_HISTORY, targetUserId, page, limit],
    getP2PMessageHistory,
    {
      enabled: !!targetUserId && !!page,
    }
  );
  return {
    data: data ?? null,
    isError,
    isLoading,
  };
};

export default useP2PMessageHistory;
