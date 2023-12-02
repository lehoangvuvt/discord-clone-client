import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IGetMessageHistoryResponse } from "@/types/api.type";
import { ChannelService } from "@/services/ChannelService";

const getNewMessages = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<IGetMessageHistoryResponse | null> => {
  const channelId = queryKey[1];
  const lastFetchDT = queryKey[2];
  const response = await ChannelService.getNewMessagesSinceDT(
    channelId,
    lastFetchDT
  );
  if (response.status === "Error") return null;
  const data: IGetMessageHistoryResponse = response.data;
  return data;
};

const useNewMessages = (
  channelId: string | null,
  lastFetchDT: string | null,
  fetchingNewMsg: boolean
): {
  data: IGetMessageHistoryResponse | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_NEW_MESSAGES, channelId, lastFetchDT],
    getNewMessages,
    {
      enabled: !!channelId && !!lastFetchDT && !!fetchingNewMsg,
    }
  );
  return {
    data: data ?? null,
    isError,
    isLoading,
  };
};

export default useNewMessages;
