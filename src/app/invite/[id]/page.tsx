"use client";

import { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url("/images/invitation-bg.gif");
  background-size: cover;
  background-position: top;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 32%;
  height: 350px;
  background: #313338;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
`;

const Invitation = ({ params }: { params: { id: string } }) => {
  return (
    <Container>
      <Content></Content>
    </Container>
  );
};

export default Invitation;
