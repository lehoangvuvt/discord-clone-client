"use client";

import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthHandler = () => {
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (userInfo && router) {
      router.push("/servers/65546be93e241c42a978df93");
    } else {
      if (pathname !== "/register") {
        router.push("/login");
      }
    }
  }, [userInfo, router]);

  return <></>;
};

export default AuthHandler;
