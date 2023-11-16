"use client";

import styled from "styled-components";
import LeftPanel from "@/components/LeftPanel";
import SocketHandler from "@/components/SocketHandler";
import Header from "@/components/Header";

const Container = styled.div``;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <LeftPanel />
      <Header />
      <SocketHandler />
      {children}
    </Container>
  );
}
