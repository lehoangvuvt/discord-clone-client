import { IPendingRegister } from "@/types/api.type";
import VerifyClient from "./client";
import { UserService } from "@/services/UserService";

const VerifyServer = async ({ params }: { params: { url: string } }) => {
  let isLoading = true;
  let pendingRegisterInfo: IPendingRegister | null = null;
  const response = await UserService.getPendingRegisterByURL(params.url);
  if (response.status === "Success") {
    pendingRegisterInfo = response.data;
  }
  isLoading = false;
  return (
    !isLoading && <VerifyClient pendingRegisterInfo={pendingRegisterInfo} />
  );
};

export default VerifyServer;
