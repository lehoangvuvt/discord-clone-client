"use client";

import { RootState } from "@/redux/store";
import { AudioOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { HeadsetOff, Headset, Mic, MicOff } from "@mui/icons-material";
import { toggleMute, toggleVolumeState } from "@/redux/slices/appSlice";

const Container = styled.div`
  position: absolute;
  height: 55px;
  width: calc((100% - 70px) * 0.18);
  background: #232428;
  bottom: 0;
  left: 70px;
  z-index: 100;
  display: flex;
  flex-flow: row wrap;
  padding: 5px 4px;
`;

const Left = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 5px;
  padding-left: 10px;
  transition: background 0.1s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-flow: column wrap;
  justify-content: center;
  span:nth-child(1) {
    color: white;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 10ch;
    font-weight: 400;
  }
  span:nth-child(2) {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 10ch;
    font-weight: 300;
  }
`;

const UserInfoPopup = styled.div`
  position: absolute;
  bottom: 62px;
  left: -20px;
  width: 350px;
  height: 420px;
  z-index: 101;
  background: #232428;
  border-radius: 6px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  animation: popupApear 0.2s ease;
  @keyframes popupApear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Right = styled.div`
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  height: 100%;
  flex: 1;
  gap: 4px;
  padding-left: 4px;
  box-sizing: border-box;
  svg {
    height: 21px;
    cursor: pointer;
    position: relavite;
  }
`;

const UserInfoTab = () => {
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const [openPopup, setOpenPopup] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const dispatch = useDispatch();
  const userVoiceState = useSelector(
    (state: RootState) => state.app.userVoiceState
  );

  return (
    <Container>
      {(openPopup || forceOpen) && <UserInfoPopup></UserInfoPopup>}
      <Left onClick={() => setForceOpen(!forceOpen)}>
        <Image
          src={userInfo?.avatar ?? ""}
          alt="user-avatar"
          width={32}
          height={32}
          style={{ borderRadius: "50%" }}
        />
        <UserInfo>
          <span>{userInfo?.name + "asdddddddd" ?? ""}</span>
          <span>{userInfo?.username ?? ""}</span>
        </UserInfo>
      </Left>
      <Right>
        {userVoiceState.mute ? (
          <MicOff onClick={() => dispatch(toggleMute())} />
        ) : (
          <Mic onClick={() => dispatch(toggleMute())} />
        )}
        {userVoiceState.volumeState == 1 ? (
          <Headset onClick={() => dispatch(toggleVolumeState())} />
        ) : (
          <HeadsetOff onClick={() => dispatch(toggleVolumeState())} />
        )}
      </Right>
    </Container>
  );
};

export default UserInfoTab;
