"use client";

import styled from "styled-components";
import UserInfoTab from "@/components/UserInfoTab";
import Header from "./header";
import LeftPanel from "@/components/LeftPanel";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Container = styled.div``;
export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();

  useEffect(() => {
    if (!params) return;
    console.log({ params });
  }, [params]);

  return (
    <Container>
      <Header
        tabType={
          params?.tabType && typeof params.tabType === "string"
            ? params.tabType
            : ""
        }
      />
      <LeftPanel />
      <UserInfoTab />
      {children}
    </Container>
  );
}
