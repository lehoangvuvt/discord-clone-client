"use client";

import styled from "styled-components";

const Container = styled.div`
  width: calc(100% - 70px);
  position: absolute;
  top: 0;
  margin-left: 70px;
  background: #313338;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  color: white;
  font-weight: 600;
  z-index: 90;
`;

const Left = styled.div`
  width: 16.5%;
  height: 50px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding-left: 20px;
  background: #2b2d31;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  transition: background 0.2s ease;
  position: relative;
  border-bottom: 1px solid #111111;
  span {
    text-overflow: ellipsis;
    max-width: 15ch;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    pointer-events: none;
  }
`;

const Center = styled.div`
  width: 68.5%;
  height: 50px;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #111111;
`;

const Right = styled.div`
  flex: 1;
  height: 50px;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #111111;
`;

const HeaderCenterFriend = () => {};

const Header = ({ tabType }: { tabType: string }) => {
  return (
    <Container>
      <Left></Left>
      {tabType !== "friends" && <Center></Center>}
      {tabType !== "friends" && <Right></Right>}
    </Container>
  );
};

export default Header;
