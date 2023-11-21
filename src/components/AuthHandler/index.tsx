"use client";

import { setUserInfo } from "@/redux/slices/appSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthHandler = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (router) {
      if (localStorage.getItem("USER_INFO")) {
        const userInfo = localStorage.getItem("USER_INFO");
        if (userInfo) {
          dispatch(setUserInfo(JSON.parse(userInfo)));
          router.push("/servers/655a15b3eb64541f47c42056");
        } else {
          router.push("/login");
        }
      } else {
        if (pathname !== "/register") {
          router.push("/login");
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <></>;
};

export default AuthHandler;
