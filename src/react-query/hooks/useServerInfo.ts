import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IServerInfo } from "@/types/api.type";
import { ServerService } from "@/services/ServerService";

const getServerInfo = async ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<IServerInfo | null> => {
  const serverId = queryKey[1];
  const response = await ServerService.getServerInfo(serverId);
  if (response.status === "Error") return null;
  return response.data;
};

const useServerInfo = (
  serverId: string
): {
  serverInfo: IServerInfo | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_SERVER_INFO, serverId],
    getServerInfo,
    {
      enabled: !!serverId && serverId !== "%40me",
    }
  );
  return {
    serverInfo: data ?? null,
    isError,
    isLoading,
  };
};

export default useServerInfo;
