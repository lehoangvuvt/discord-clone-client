"use client";

import ChatHandler from "@/components/ChatHandler";
import { SeparateLine } from "@/components/StyledComponents";
import QUERY_KEY from "@/react-query/consts";
import useFriendsList from "@/react-query/hooks/useFriendsList";
import useP2PMessageHistory from "@/react-query/hooks/useP2PMessageHistory";
import { socket } from "@/services/socket";
import { IMessage, IUserInfoLite } from "@/types/api.type";
import useStore from "@/zustand/useStore";
import CallIcon from "@mui/icons-material/Call";
import { FastAverageColor } from "fast-average-color";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% + 50px);
  display: flex;
  top: 0px;
  margin-top: 0px;
  flex-flow: flex wrap;
  position: absolute;
  top: -50.5px;
  background: #313338;
  z-index: 91;
`;

const ChatContentContainer = styled.div`
  background: #313338;
  width: calc(73% - 5px);
  height: 100%;
  display: flex;
  flex-flow: column wrap;
`;

const TargetUserInfo = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  background: #232428;
`;

const TargetUserInfoHeader = styled.div`
  width: 100%;
  height: 51px;
  border-bottom: 1px solid #111111;
  box-sizing: border-box;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  margin-bottom: 0px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0px 20px;
  gap: 15px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  background: #313338;
`;

const BigAvatarContainer = styled.div<{ $bgColor: string; $bgImg: string }>`
  width: 100%;
  height: 120px;
  background: ${(props) => props.$bgColor};
  // background-image: ${(props) => `url("${props.$bgImg}")`};
  // background-position: top;
  // background-size: 100%;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  height: 51px;
  border-bottom: 1px solid #111111;
  box-sizing: border-box;
  box-shadow: 0px 10px 13px -7px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0px 20px;
  gap: 15px;
  color: white;
  font-size: 14px;
  background: #313338;
  font-weight: 600;
  div:nth-child(2) {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color 0.1s ease;
    &:hover {
      color: rgba(255, 255, 255, 0.95);
    }
  }
`;

const BigAvatarImage = styled.div<{ $bgImg: string }>`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #232428;
  transform: translateX(20%) translateY(80%);
  z-index: 100;
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: scale(0.88);
    background-image: ${(props) => `url("${props.$bgImg}")`};
    background-size: cover;
    background-position: center;
    position: absolute;
  }
`;

const UserInfo = styled.div`
  width: calc(100% - 20px);
  background: #111214;
  margin: 70px auto auto auto;
  border-radius: 6px;
  padding: 5px;
  display: flex;
  flex-flow: column wrap;
  gap: 8px;
  padding: 15px;
`;

const UserInfoSection = styled.div`
  display: flex
  flex-flow: column wrap;

  h1{
    color: white;
    font-weight: 700;
    font-size: 15px;
  }
  h2 {
    color: white;
    font-weight:700;
    font-size: 12px;
  }
  p {
    color: rgba(255,255,255,0.65);
    font-size: 14px;
    margin-top: 2px;
  }
  textarea {
    border: none;
    outline: none;
    background: transparent;
    color: rgba(255,255,255,0.7);
    font-size: 12px;
    width: 100%;
    margin-top: 5px;
    overflow: auto;
    padding-right: 0px;
    &::placeholder {
      font-size: 12px;
      padding-left: 2px;
    }
  }
`;

export default function ChatP2P() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { userInfo } = useStore();
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const msgInputRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { friends } = useFriendsList();
  const [targetUserInfo, setTargetUserInfo] = useState<IUserInfoLite | null>(
    null
  );
  const { data: useMessageHistoryData } = useP2PMessageHistory(
    searchParams.get("id"),
    currentPage,
    100
  );
  // const {
  //   start: startVoice,
  //   stop: stopVoice,
  //   inVoiceChannel,
  //   setInVoiceChannel,
  // } = useVoiceChat(socket, "p2p");
  const [lastFetchMessageDT, setLastFetchMessageDT] = useState<string | null>(
    null
  );
  const userAvatarRef = useRef<HTMLImageElement>(null);
  const [dominantColor, setDominantColor] = useState("#111111");

  useEffect(() => {
    if (!targetUserInfo || !userAvatarRef || !userAvatarRef.current) return;
    const getColor = async () => {
      if (!userAvatarRef || !userAvatarRef.current) return;
      const fac = new FastAverageColor();
      try {
        const color = await fac.getColorAsync(userAvatarRef.current);
        setDominantColor(color.hex);
      } catch (error) {
        console.log(error);
      }
    };
    getColor();
  }, [targetUserInfo]);

  useEffect(() => {
    const targetUserId = searchParams.get("id");
    if (friends && friends.length > 0 && targetUserId) {
      const info = friends.filter((friend) => friend._id === targetUserId)[0];
      setTargetUserInfo(info);
    }
  }, [friends, searchParams]);
  // const [fetchingNewMsg, setFetchingNewMsg] = useState(false);
  // const {
  //   data: useNewMessageData,
  //   isError,
  //   isLoading,
  // } = useP2PNewMessages(
  //   searchParams.get("targetUserId"),
  //   lastFetchMessageDT,
  //   fetchingNewMsg
  // );

  useEffect(() => {
    // setMessageHistory([]);
    // return () => {
    //   stopVoice(params.serverId);
    //   setMessageHistory([]);
    // };
  }, []);

  useEffect(() => {
    // if (!params || !params.serverId || params.serverId === "@me" || !userInfo)
    //   return;
    // socket.emit(
    //   "joinServer",
    //   JSON.stringify({
    //     _id: userInfo._id,
    //     serverId: params.serverId,
    //   })
    // );
  }, [userInfo]);

  useEffect(() => {
    if (msgInputRef && msgInputRef.current) {
      msgInputRef.current.innerHTML = "";
    }
    const targetUserId = searchParams.get("id");
    if (userInfo && targetUserId) {
      if (socket) {
        socket.on("receiveP2PMessage", handleReceiveP2PMessage);
      }
    }
    return () => removeAllSocketListener();
  }, [searchParams]);

  const removeAllSocketListener = () => {
    socket.off(`receiveP2PMessage`, handleReceiveP2PMessage);
  };

  useEffect(() => {
    setMessageHistory([]);
    setCurrentPage(1);
  }, []);

  const handleReceiveP2PMessage = () => {
    queryClient.invalidateQueries([QUERY_KEY.GET_P2P_MESSAGE_HISTORY]);
  };

  // useEffect(() => {
  //   if (useNewMessageData && useNewMessageData.data.length > 0) {
  //     const { data } = useNewMessageData;
  //     setMessageHistory([...messageHistory, data[data.length - 1]]);
  //     setLastFetchMessageDT(data[data.length - 1].createdAt);
  //     setFetchingNewMsg(false);
  //   }
  // }, [useNewMessageData]);

  useEffect(() => {
    if (useMessageHistoryData) {
      const { currentPage, data, hasMore, totalPage } = useMessageHistoryData;
      if (data.length > 0) {
        setMessageHistory(data);
        setLastFetchMessageDT(data[data.length - 1].createdAt);
      }
    }
  }, [useMessageHistoryData]);

  useEffect(() => {
    if (messageHistory?.length > 0 && lastFetchMessageDT) {
      if (
        messageHistory[messageHistory.length - 1].createdAt !==
        lastFetchMessageDT
      ) {
      }
    }
  }, [messageHistory, lastFetchMessageDT]);

  const handleSendMessage = async (
    message: string,
    fileIds: string[],
    userId: string
  ) => {
    const targetUserId = searchParams.get("id");
    if (socket && targetUserId) {
      socket.emit(
        "sendP2PMessage",
        JSON.stringify({
          message,
          userId,
          fileIds,
          receiverId: targetUserId,
        })
      );
    } else {
      alert("Please input message");
    }
  };

  return (
    <Container>
      <ChatContentContainer>
        <Header>
          <div
            style={{
              width: "50%",
              display: "flex",
              flexFlow: "row wrap",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Image
              ref={userAvatarRef}
              alt="target-user-avatar"
              width={28}
              height={28}
              style={{ borderRadius: "50%", width: "28px", height: "28px" }}
              src={targetUserInfo?.avatar ?? ""}
            />
            {targetUserInfo?.name}
          </div>
          <div>
            <CallIcon color="inherit" />
          </div>
        </Header>
        <ChatHandler
          style={{ height: "calc(100% - 56px)", width: "100%" }}
          messageHistory={messageHistory}
          sendMessage={handleSendMessage}
        />
      </ChatContentContainer>
      <TargetUserInfo>
        <TargetUserInfoHeader></TargetUserInfoHeader>
        <BigAvatarContainer
          $bgColor={dominantColor}
          $bgImg={targetUserInfo?.avatar ?? ""}
        >
          <BigAvatarImage $bgImg={targetUserInfo?.avatar ?? ""} />
        </BigAvatarContainer>
        <UserInfo>
          <UserInfoSection>
            <h1>{targetUserInfo?.name}</h1>
            <h2>{targetUserInfo?.username}</h2>
          </UserInfoSection>
          <SeparateLine />
          <UserInfoSection>
            <h2>MEMBER SINCE</h2>
            <p>
              {new Date(
                targetUserInfo?.createdAt ?? Date.now()
              ).toLocaleDateString()}
            </p>
          </UserInfoSection>
          <SeparateLine />
          <UserInfoSection>
            <h2>Note</h2>
            <textarea maxLength={100} placeholder="Click to add note" />
          </UserInfoSection>
        </UserInfo>
      </TargetUserInfo>
    </Container>
  );
}
