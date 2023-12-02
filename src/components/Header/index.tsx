"use client";

import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Popover from "../Popover";
import { useState } from "react";
import { SeparateLine } from "../StyledComponents";
import { setChannelId, setServer, setUserInfo } from "@/redux/slices/appSlice";
import { useRouter } from "next/navigation";
import { ServerService } from "@/services/ServerService";
import { UserService } from "@/services/UserService";

const Container = styled.div`
  width: calc(100% - 70px);
  position: absolute;
  top: 0;
  margin-left: 70px;
  background: #313338;
  height: 50px;
  border-bottom: 1px solid #111111;
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
  span {
    text-overflow: ellipsis;
    max-width: 15ch;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    pointer-events: none;
  }
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }
`;

const Center = styled.div`
  width: 68.5%;
  height: 50px;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
`;

const Right = styled.div`
  flex: 1;
  height: 50px;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
`;

const ServerPopupContainer = styled.div`
  width: 225px;
  display: flex;
  flex-flow: column wrap;
  background: #1e1f22;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  gap: 0px;
  padding: 8px 8px;
`;

const ServerPopupItem = styled.div<{ hoverBgColor?: string }>`
  width: 100%;
  padding: 8px 8px;
  font-size: 13px;
  text-transform: none;
  border-radius: 2px;
  display: flex;
  align-items: center;
  &: hover {
    background: ${(props) => props.hoverBgColor ?? "#5865f2"};
  }
`;

const ServerPopup = ({
  onLeaveFinished,
}: {
  onLeaveFinished: (isSuccess: boolean) => void;
}) => {
  const currentConnection = useSelector(
    (state: RootState) => state.app.currentConnection
  );
  const handleLeaveServer = async () => {
    if (
      !currentConnection ||
      !currentConnection.server ||
      currentConnection.server === "@me"
    )
      return;
    const response = await ServerService.leaveServer(
      currentConnection.server._id
    );
    if (response.status === "Success") {
      onLeaveFinished(true);
    } else {
      onLeaveFinished(false);
    }
  };

  return (
    <ServerPopupContainer>
      <ServerPopupItem onClick={() => alert(true)}>
        Invite people
      </ServerPopupItem>
      <SeparateLine />
      <ServerPopupItem
        hoverBgColor="#FF1744"
        onClick={() => handleLeaveServer()}
      >
        Leave Server
      </ServerPopupItem>
    </ServerPopupContainer>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentConnection = useSelector(
    (state: RootState) => state.app.currentConnection
  );
  const [isOpenServerPopup, setOpenServerPopup] = useState(false);

  const handleOnLeaveFinished = async (isSuccess: boolean) => {
    if (isSuccess) {
      const authenticationResponse = await UserService.athentication();
      if (authenticationResponse.status === "Success") {
        setOpenServerPopup(false);
        dispatch(setUserInfo(authenticationResponse.data));
        dispatch(setServer(null));
        dispatch(setChannelId(null));
        router.push("/me/friends");
      }
    }
  };

  return (
    <Container>
      <Left
        onClick={(e) => {
          if (e.target === e.currentTarget)
            setOpenServerPopup(!isOpenServerPopup);
        }}
      >
        <span>
          {currentConnection?.server !== "@me"
            ? currentConnection?.server?.name
            : "Direct"}
        </span>
        <Popover isOpen={isOpenServerPopup} marginTop="7px">
          <ServerPopup onLeaveFinished={handleOnLeaveFinished} />
        </Popover>
      </Left>
      <Center></Center>
      <Right></Right>
    </Container>
  );
};

export default Header;
