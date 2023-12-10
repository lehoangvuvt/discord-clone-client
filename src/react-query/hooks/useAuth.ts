import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IUserInfo } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const authentication = async (): Promise<IUserInfo | null> => {
  const response = await UserService.athentication();
  if (response.status === "Error") return null;
  const data = response.data;
  return data;
};

const useAuth = (): {
  authenticationData: IUserInfo | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.AUTHENTICATE],
    authentication
  );
  return {
    authenticationData: data ?? null,
    isError,
    isLoading,
  };
};

export default useAuth;
