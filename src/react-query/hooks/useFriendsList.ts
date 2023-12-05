import { useQuery } from "react-query";
import QUERY_KEY from "../consts";
import { IUserInfoLite, RelationshipTypeEnum } from "@/types/api.type";
import { UserService } from "@/services/UserService";

const getFriendsList = async ({
  queryKey,
}: {
  queryKey: any[];
}): Promise<IUserInfoLite[] | null> => {
  const response = await UserService.getFriendsList();
  if (response.status === "Error") return null;
  return response.data;
};

const useFriendsList = (): {
  friends: IUserInfoLite[] | null;
  isLoading: boolean;
  isError: boolean;
} => {
  const { data, isError, isLoading } = useQuery(
    [QUERY_KEY.GET_FRIENDS_LIST],
    getFriendsList
  );
  return {
    friends: data ?? null,
    isError,
    isLoading,
  };
};

export default useFriendsList;
