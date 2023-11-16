"use client";

import styled from "styled-components";

const Container = styled.div`
  width: calc(100% - 70px);
  position: absolute;
  top: 0;
  margin-left: 70px;
  background: #313338;
  height: 50px;
  border-bottom: 1px solid #111111;
  box-sizing: border-box;
`;

const Header = () => {
  return <Container>Header</Container>;
};

export default Header;
