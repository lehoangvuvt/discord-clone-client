"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import CreateServerPopup from "./CreateServerPopup";
import { NotificationDot, SeparateLine } from "../StyledComponents";
import ThreePIcon from "@mui/icons-material/ThreeP";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserService } from "@/services/UserService";
import { socket } from "@/services/socket";
import useStore from "@/zustand/useStore";
import { ActivityVerbEnum } from "@/types/api.type";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: #1e1f22;
  height: 100%;
  width: 70px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
`;

const PanelItem = styled(Link)`
  position: relative;
  width: 100%;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;

  &:after {
    content: "";
    position: absolute;
    left: -7px;
    background: white;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    transition: all 0.2s ease;
  }

  &.selected {
    &:after {
      height: 100%;
      border-radius: 3px;
    }
    img,
    div:nth-child(1) {
      border-radius: 20%;
      filter: brightness(110%);
    }
    div:nth-child(1) {
      background: #5865f2;
    }
  }

  img {
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  &:hover {
    &.non-selected {
      &:after {
        height: 15px;
        border-radius: 2px;
      }
      img,
      div:nth-child(1) {
        border-radius: 20%;
        filter: brightness(110%);
      }
      div:nth-child(1) {
        background: #5865f2;
      }
    }
  }
`;

const AddServerButton = styled.div`
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 28px;
  color: #02b875;
  cursor: pointer;
  transition: all 0.2s ease;
  &.selected,
  &:hover {
    border-radius: 20%;
    color: white;
    background: #02b875;
  }
`;

const LogoutButton = styled(AddServerButton)`
  color: white;
  position: absolute;
  bottom: 0px;
  transform: translateY(-20px);
  font-size: 26px;
  &.selected,
  &:hover {
    border-radius: 20%;
    color: black;
    background: white;
  }
`;

const TextAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2b2d31;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
`;

const ServersContainer = styled.div`
  width: 100%;
  max-height: 400px;
  display: flex;
  flex-flow: row wrap;
  overflow-y: auto;
  gap: 15px;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 0px;
  &::-webkit-scrollbar-thumb {
    width:0px;
  }
`;

const LeftPanel = () => {
  const params = useParams();
  const { userInfo, setUserInfo, setChannelId, setServer, currentConnection } =
    useStore();
  const [isOpenCreateServer, setOpenCreateServer] = useState(false);
  const { notifications } = useStore();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await UserService.logout();
    if (response.status === "Success") {
      setUserInfo(null);
      setChannelId(null);
      setServer(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (
      params &&
      userInfo &&
      (userInfo.joinedServers?.length > 0 ||
        userInfo?.createdServers?.length > 0)
    ) {
      if (params.serverId) {
        const foundServers = [
          ...userInfo.joinedServers,
          ...userInfo.createdServers,
        ].filter((server) => server._id == params.serverId);
        if (params.serverId) {
          if (foundServers?.length > 0) {
            setServer(foundServers[0]);
            setChannelId(null);
          }
        }
      } else {
        setServer("@me");
        setChannelId("@me");
      }
    }
  }, [params, userInfo]);

  const getShortFormServerName = (serverName: string): string => {
    const arr = serverName.split(" ");
    let shortForm = "";
    arr.forEach((ele, i) => {
      if (i > 1) return;
      shortForm += ele.substring(0, 1);
    });
    return shortForm;
  };

  const handleLeaveServer = () => {
    if (
      currentConnection.server &&
      currentConnection.server !== "@me" &&
      userInfo
    )
      socket.emit(
        "leaveServer",
        JSON.stringify({
          _id: userInfo._id,
        })
      );
  };

  return (
    <Container>
      <PanelItem
        className={
          currentConnection.server === "@me" ? "selected" : "non-selected"
        }
        onClick={() => handleLeaveServer()}
        href={`/me/friends`}
        shallow={true}
        key="@me"
      >
        <TextAvatar>
          <ThreePIcon color="inherit" style={{ height: "100%" }} />{" "}
        </TextAvatar>
        {notifications && notifications.ADD_FRIEND.length > 0 && (
          <NotificationDot
            style={{
              position: "absolute",
              bottom: "-5px",
              right: "10px",
            }}
          >
            {notifications.ADD_FRIEND.length}
          </NotificationDot>
        )}
      </PanelItem>
      <SeparateLine
        width="55%"
        height="1px"
        color="rgba(255,255,255,0.2)"
        style={{ borderRadius: "6px" }}
      />
      <ServersContainer>
        {userInfo &&
          userInfo.joinedServers?.length > 0 &&
          userInfo.joinedServers.map((ele) => (
            <PanelItem
              href={`/servers/${ele._id}`}
              shallow={true}
              className={
                currentConnection.server !== "@me" &&
                currentConnection.server?._id == ele._id
                  ? "selected"
                  : "non-selected"
              }
              key={ele._id}
            >
              {ele.avatar?.length > 0 ? (
                <Image
                  alt="channel-img"
                  src={ele.avatar}
                  width={48}
                  height={48}
                  style={{ width: "48px", height: "48px" }}
                />
              ) : (
                <TextAvatar>{getShortFormServerName(ele.name)}</TextAvatar>
              )}
            </PanelItem>
          ))}
      </ServersContainer>
      <AddServerButton
        onClick={() => setOpenCreateServer(true)}
        className={isOpenCreateServer ? "selected" : ""}
      >
        <AddIcon fontSize="inherit" color="inherit" />
      </AddServerButton>
      <CreateServerPopup
        isOpen={isOpenCreateServer}
        closePopup={() => setOpenCreateServer(false)}
      />
      <SeparateLine
        width="55%"
        height="1px"
        color="rgba(255,255,255,0.2)"
        style={{ borderRadius: "6px" }}
      />
      <LogoutButton onClick={() => handleLogout()}>
        <LogoutIcon fontSize="inherit" color="inherit" />
      </LogoutButton>
    </Container>
  );
};

export default LeftPanel;
