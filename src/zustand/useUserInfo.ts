import { IUserInfo } from "@/types/api.type";
import { create } from "zustand";
import zukeeper from "zukeeper";

type UserInfoState = {
  userInfo: IUserInfo | null;
  setUserInfo: (userInfo: IUserInfo | null) => void;
};

const useUserInfo = create<UserInfoState>(
  zukeeper((set: any) => ({
    userInfo: null,
    setUserInfo: (userInfo: IUserInfo | null) =>
      set((state: UserInfoState) => ({ userInfo: userInfo })),
  }))
);

export default useUserInfo;
