import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IGetMessageHistoryResponse } from "@/types/api.type";
import { APIService } from "@/services/ApiService";

const getMessageHistory = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<IGetMessageHistoryResponse | null> => {
  const channelId = queryKey[1];
  const page = queryKey[2];
  const limit = queryKey[3];
  const response = await APIService.getMessageHistory(channelId, page, limit);
  if (response.status === "Error") return null;
  return response.data;
};

const useMessageHistory = (
  channelId: string | null,
  page: number,
  limit: number
): {
  data: IGetMessageHistoryResponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_MESSAGE_HISTORY, channelId, page, limit],
    getMessageHistory,
    {
      enabled: !!channelId && !!page,
    }
  );
  return {
    data: data ?? null,
    isError,
    isLoading,
  };
};

export default useMessageHistory;
