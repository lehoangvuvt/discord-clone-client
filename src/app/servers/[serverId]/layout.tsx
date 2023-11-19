"use client";

import styled from "styled-components";
import LeftPanel from "@/components/LeftPanel";
import SocketHandler from "@/components/SocketHandler";
import Header from "@/components/Header";
import UserInfoTab from "@/components/UserInfoTab";

const Container = styled.div``;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Header />
      <LeftPanel />
      <UserInfoTab />
      <SocketHandler />
      {children}
    </Container>
  );
}
