"use client";

import { setUserInfo } from "@/redux/slices/appSlice";
import { RootState } from "@/redux/store";
import { APIService } from "@/services/ApiService";
import { socket } from "@/services/socket";
import { usePathname, useRouter } from "next/navigation";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthHandler = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useSelector((state: RootState) => state.app.userInfo);

  useEffect(() => {
    if (!router || !pathname || !dispatch) return;

    const authentication = async () => {
      const authenticationResponse = await APIService.athentication();
      if (authenticationResponse.status === "Success") {
        dispatch(setUserInfo(authenticationResponse.data));
        if (!pathname.includes("/servers")) {
          router.push("/servers/@me");
        }
      } else {
        const getAccessTokenResponse =
          await APIService.getAccessTokenByRefreshToken();
        if (getAccessTokenResponse.status === "Success") {
          dispatch(setUserInfo(getAccessTokenResponse.data));
          router.push("/servers/@me");
        } else {
          if (pathname !== "/register") {
            router.push("/login");
          }
        }
      }
    };

    authentication();
  }, []);

  const onConnect = () => {};
  const onDisconnect = () => {};

  useEffect(() => {
    if (userInfo) {
      socket.auth = { accessToken: userInfo.accessToken };
      socket.connect();
      socket.on("connect", onConnect);
      socket.on("disconnect", onConnect);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }
  }, [userInfo]);

  return <></>;
};

export default AuthHandler;
