import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IChannel, IServerInvitationDetails } from "@/types/api.type";
import { ServerService } from "@/services/ServerService";

const getServerInvitationDetails = async ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<IServerInvitationDetails | null> => {
  const invitation_short_id = queryKey[1];
  const response = await ServerService.getServerInvitationDetails(
    invitation_short_id
  );
  if (response.status === "Error") return null;
  return response.data;
};

const useServerInvitationDetails = (
  invitation_short_id: string
): {
  serverInvitationDetails: IServerInvitationDetails | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_SERVER_INVITATION_DETAILS, invitation_short_id],
    getServerInvitationDetails,
    {
      enabled: !!invitation_short_id,
    }
  );
  return {
    serverInvitationDetails: data ?? null,
    isError,
    isLoading,
  };
};

export default useServerInvitationDetails;
