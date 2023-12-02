import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IChannel } from "@/types/api.type";
import { ServerService } from "@/services/ServerService";

const getChannels = async ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<IChannel[] | null> => {
  const serverId = queryKey[1];
  const response = await ServerService.getServerChannels(serverId);
  if (response.status === "Error") return null;
  return response.data;
};

const useChannels = (
  serverId: string
): { channels: IChannel[] | null; isLoading: boolean; isError: boolean } => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_CHANNELS, serverId],
    getChannels,
    {
      enabled: !!serverId && serverId !== "%40me",
    }
  );
  return {
    channels: data ?? null,
    isError,
    isLoading,
  };
};

export default useChannels;
