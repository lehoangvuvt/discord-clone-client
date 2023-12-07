import { ServerService } from "@/services/ServerService";
import InvitationClient from "./client";
import { IServerInvitationDetails } from "@/types/api.type";

const Invitation = async ({ params }: { params: { id: string } }) => {
  let invitationDetails = null as IServerInvitationDetails | null;
  const response = await ServerService.getServerInvitationDetails(params.id);
  if (response.status === "Success") invitationDetails = response.data;
  return <InvitationClient invitationDetails={invitationDetails} />;
};

export default Invitation;
