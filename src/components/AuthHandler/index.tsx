"use client";

import QUERY_KEY from "@/react-query/consts";
import { setNotification } from "@/redux/slices/appSlice";
import { RootState } from "@/redux/store";
import { UserService } from "@/services/UserService";
import { socket } from "@/services/socket";
import useUserInfo from "@/zustand/useUserInfo";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

const AuthHandler = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo, setUserInfo } = useUserInfo();

  useEffect(() => {
    if (!router || !pathname || !dispatch) return;

    const authentication = async () => {
      const authenticationResponse = await UserService.athentication();
      if (authenticationResponse.status === "Success") {
        setUserInfo(authenticationResponse.data);
        if (!pathname.includes("/servers") && !pathname.includes("/invite")) {
          router.push("/me/friends");
        }
      } else {
        const getAccessTokenResponse =
          await UserService.getAccessTokenByRefreshToken();
        if (getAccessTokenResponse.status === "Success") {
          setUserInfo(getAccessTokenResponse.data);
          router.push("/me/friends");
        } else {
          socket.removeAllListeners();
          socket.disconnect();
          if (pathname !== "/register") {
            router.push("/login");
          }
        }
      }
    };

    authentication();
  }, []);

  const onConnect = () => {
    socket.on("receiveFriendRequest", handleReceiveFriendRequest);
    socket.on("receiveUpdatePendingRequest", handleReceiveUpdatePendingRequest);
  };

  const handleReceiveFriendRequest = () => {
    queryClient.invalidateQueries([QUERY_KEY.GET_PENDING_REQUESTS]);
  };

  const handleReceiveUpdatePendingRequest = () => {
    queryClient.invalidateQueries([QUERY_KEY.GET_FRIENDS_LIST]);
    queryClient.invalidateQueries([QUERY_KEY.GET_PENDING_REQUESTS]);
  };

  const onDisconnect = () => {
    socket.removeAllListeners();
  };

  useEffect(() => {
    if (userInfo) {
      socket.auth = { accessToken: userInfo.accessToken };
      socket.connect();
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
    }
  }, [userInfo]);

  return <></>;
};

export default AuthHandler;
