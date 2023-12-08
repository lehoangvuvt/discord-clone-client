"use client";

import styled from "styled-components";
import Popover from "../Popover";
import { useEffect, useRef, useState } from "react";
import { SeparateLine } from "../StyledComponents";
import { useRouter } from "next/navigation";
import { ServerService } from "@/services/ServerService";
import { UserService } from "@/services/UserService";
import Popup from "../Popup";
import { IServerInfo, IServerInvitation } from "@/types/api.type";
import Button from "../Button";
import useStore from "@/zustand/useStore";

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

const ServerInvitationContainer = styled.div`
  background: #313338;
  width: 700px;
  border-radius: 6px;
  padding: 20px 20px;
  h1 {
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
  }
  p {
    font-weight: 500;
    font-size: 11px;
    padding-top: 10px;
    color: rgba(255, 255, 255, 0.7);
  }
  a {
    color: #0a8fd1;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ServerInvitationInputContainer = styled.div`
  position: relative;
  input {
    width: 100%;
    background: #1e1f22;
    border: none;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 400;
    border-radius: 4px;
    padding: 10px 90px 10px 10px;
    outline: none;
  }
  button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 5px;
    height: 32px;
    width: 78px;
    background: #5865f2;
  }
  &.copied {
    button {
      background: #248046;
    }
  }
`;

const ServerPopup = ({
  onLeaveFinished,
  onClickInvite,
}: {
  onLeaveFinished: (isSuccess: boolean) => void;
  onClickInvite: () => void;
}) => {
  const { currentConnection } = useStore();
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
      <ServerPopupItem onClick={onClickInvite}>Invite people</ServerPopupItem>
      <SeparateLine />
      <ServerPopupItem hoverBgColor="#FF1744" onClick={handleLeaveServer}>
        Leave Server
      </ServerPopupItem>
    </ServerPopupContainer>
  );
};

const Header = () => {
  const { setServer, setChannelId, currentConnection } = useStore();
  const router = useRouter();
  const [isOpenServerInfo, setOpenServerInfo] = useState(false);
  const [selectedServerInfo, setSelectedServerInfo] =
    useState<IServerInfo | null>(null);
  const [isOpenServerPopup, setOpenServerPopup] = useState(false);
  const [isCopied, setCopied] = useState(false);
  const serverInvitationInputRef = useRef<HTMLInputElement>(null);
  const [serverInvitation, setServerInvitation] =
    useState<IServerInvitation | null>(null);
  const { userInfo, setUserInfo } = useStore();

  const handleOnLeaveFinished = async (isSuccess: boolean) => {
    if (isSuccess) {
      const authenticationResponse = await UserService.athentication();
      if (authenticationResponse.status === "Success") {
        setOpenServerPopup(false);
        setUserInfo(authenticationResponse.data);
        setServer(null);
        setChannelId(null);
        router.push("/me/friends");
      }
    }
  };

  useEffect(() => {
    if (
      currentConnection.server &&
      currentConnection.server !== "@me" &&
      userInfo
    ) {
      const currentServerId = currentConnection.server._id;
      const selectedServerInfo = userInfo.joinedServers.filter(
        (server) => server._id === currentServerId
      )[0];
      setSelectedServerInfo(selectedServerInfo);
    }
  }, [currentConnection, userInfo]);

  const handleCopy = () => {
    if (serverInvitationInputRef && serverInvitationInputRef.current) {
      serverInvitationInputRef.current.select();
      serverInvitationInputRef.current.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(serverInvitationInputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const handleOnClickInvite = async () => {
    if (!selectedServerInfo) return;
    setServerInvitation(null);
    setOpenServerPopup(false);
    setOpenServerInfo(true);
    const response = await ServerService.createServerInvitation(
      selectedServerInfo._id
    );
    if (response.status === "Success") {
      setServerInvitation(response.data);
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
          <ServerPopup
            onLeaveFinished={handleOnLeaveFinished}
            onClickInvite={handleOnClickInvite}
          />
        </Popover>
      </Left>
      <Center></Center>
      <Right></Right>
      <Popup
        isOpen={isOpenServerInfo}
        closePopup={() => setOpenServerInfo(false)}
      >
        <ServerInvitationContainer>
          <h1>
            Invite friends to{" "}
            <span style={{ fontWeight: 700 }}>{selectedServerInfo?.name}</span>
          </h1>
          <ServerInvitationInputContainer className={isCopied ? "copied" : ""}>
            <input
              onClick={() => {
                if (
                  serverInvitationInputRef &&
                  serverInvitationInputRef.current
                ) {
                  serverInvitationInputRef.current.select();
                }
              }}
              ref={serverInvitationInputRef}
              readOnly
              value={
                serverInvitation
                  ? `${process.env.NEXT_PUBLIC_URL}/invite/${serverInvitation?.invitation_short_id}`
                  : `${process.env.NEXT_PUBLIC_URL}/invite`
              }
            />
            <Button onClick={handleCopy}>{isCopied ? "Copied" : "Copy"}</Button>
          </ServerInvitationInputContainer>
          <p>
            Your invite link expires in 7 days. <a>Edit invite link.</a>
          </p>
        </ServerInvitationContainer>
      </Popup>
    </Container>
  );
};

export default Header;
