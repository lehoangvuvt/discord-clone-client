"use client";

import { setUserInfo } from "@/redux/slices/appSlice";
import { APIService } from "@/services/ApiService";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";

const AuthHandler = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!router || !pathname || !dispatch) return;
    const authentication = async () => {
      const result = await APIService.athentication();
      if (result.data) {
        dispatch(setUserInfo(result.data));
        router.push("/servers/655a15b3eb64541f47c42056");
      } else {
        if (pathname !== "/register") {
          router.push("/login");
        }
      }
    };
    authentication();
  }, [router, pathname, dispatch]);

  return <></>;
};

export default AuthHandler;
