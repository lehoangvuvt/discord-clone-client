"use client";

import ChatHandler from "@/components/ChatHandler";
import Popup from "@/components/Popup";
import Tree from "@/components/Tree";
import useVoiceChat from "@/hooks/useVoiceChat";
import useMessageHistory from "@/react-query/hooks/useMessageHistory";
import useNewMessages from "@/react-query/hooks/useNewMessages";
import { socket } from "@/services/socket";
import { IChannel, IMessage, IUserInfo } from "@/types/api.type";
import useStore from "@/zustand/useStore";
import { VolumeUp, VolumeMute } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: #313338;
  position: absolute;
  width: calc(100% - 70px);
  margin-left: 70px;
  height: calc(100% - 50px);
  display: flex;
  flex-flow: row wrap;
  margin-top: 50px;
`;

const Left = styled.div`
  width: 16.5%;
  height: 100%;
  background: #2b2d31;
  color: white;
  padding-top: 20px;
`;

const ChannelsContainer = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-flow: column wrap;
  gap: 4px;
`;

const ChannelItem = styled.div`
  min-height: 36px;
  color: white;
  font-weight: 500;
  box-sizing: border-box;
  font-size: 14px;
  padding: 5px 10px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  span:nth-child(1) {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 5px;
    font-size: 18px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    color: rgba(255, 255, 255, 1);
    background: rgba(255, 255, 255, 0.15);
  }
  svg {
    margin-left: -5px;
    height: 21px;
  }
`;

const OnlineUsersContainer = styled.div`
  width: 15%;
  height: 100%;
  background: #2b2d31;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 10px;
    background: rgba(0, 0, 0, 0.125);
  }
  &::-webkit-scrollbar-thumb {
    width: 10px;
    background: #111111;
    border-radius: 6px;
  }
`;

const OnlineTitle = styled.div`
  width: 100%;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
  padding: 20px 20px;
`;

const OnlineUserItem = styled.div`
  width: 92%;
  margin: 0 auto;
  height: 45px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 10px;
  color: #d3672b;
  font-weight: 700;
  font-size: 14px;
  box-sizing: border-box;
  padding-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChannelTypeTitle = styled.div`
  width: 100%;
  padding: 10px 10px;
  font-size: 11px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  letter-spacing: 0.5px;
  pointer-events: none;
`;

const NewMsgNotify = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 97.5%;
  margin-left: 1%;
  padding: 8px 10px;
  background: #5663e9;
  color: white;
  z-index: 50;
  font-size: 13px;
  font-weight: 600;
  border-radius: 0px 0px 6px 6px;
`;

export default function Server({ params }: { params: any }) {
  const { currentConnection, setChannelId, userInfo } = useStore();
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const [onlineUsers, setOnineUsers] = useState<IUserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openCreateChannelPopup, setOpenCreateChannelPopup] = useState(false);
  const { data: useMessageHistoryData } = useMessageHistory(
    currentConnection.channelId,
    currentPage,
    100
  );
  const {
    start: startVoice,
    stop: stopVoice,
    inVoiceChannel,
    setInVoiceChannel,
  } = useVoiceChat(socket, "channel");
  const [lastFetchMessageDT, setLastFetchMessageDT] = useState<string | null>(
    null
  );
  const [fetchingNewMsg, setFetchingNewMsg] = useState(false);
  const {
    data: useNewMessageData,
    isError,
    isLoading,
  } = useNewMessages(
    currentConnection.channelId,
    lastFetchMessageDT,
    fetchingNewMsg
  );

  useEffect(() => {
    setMessageHistory([]);
    return () => {
      stopVoice(params.serverId);
      setMessageHistory([]);
    };
  }, []);

  useEffect(() => {
    if (!params || !params.serverId || params.serverId === "@me" || !userInfo)
      return;
    socket.emit(
      "joinServer",
      JSON.stringify({
        _id: userInfo._id,
        serverId: params.serverId,
      })
    );
  }, [userInfo]);

  useEffect(() => {
    if (
      userInfo &&
      currentConnection.channelId &&
      currentConnection.channelId !== "@me"
    ) {
      const data = {
        _id: userInfo._id,
        channelId: currentConnection.channelId,
      };
      if (socket) {
        socket.emit("joinChannel", JSON.stringify(data));
        socket.on("joinedChannel", handleJoinedChannel);
      }
    }
    return () => {
      if (currentConnection.channelId && socket) {
        removeAllSocketListener();
      }
    };
  }, [currentConnection.channelId]);

  const removeAllSocketListener = () => {
    if (currentConnection.channelId && userInfo) {
      socket.off("joinedChannel", handleJoinedChannel);
      socket.off(`receiveOnlineChannel`, getUsersByIds);
      setMessageHistory([]);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    setMessageHistory([]);
    setCurrentPage(1);
  }, [currentConnection.server]);

  const handleJoinedChannel = (channelId: string) => {
    socket.on(`receiveOnlineChannel`, getUsersByIds);
  };

  useEffect(() => {
    if (lastFetchMessageDT && currentConnection.channelId && userInfo) {
      socket.on(`receiveMessageChannel`, getNewMessagesSinceDT);
      return () => {
        socket.off(`receiveMessageChannel`, getNewMessagesSinceDT);
      };
    }
  }, [lastFetchMessageDT, currentConnection.channelId, userInfo]);

  const handleSelectChannel = async (channel: IChannel) => {
    setMessageHistory([]);
    setOnineUsers([]);
    setChannelId(channel._id);
  };

  const getUsersByIds = async (data: string) => {
    const userIds = JSON.parse(data);
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/get-users-by-ids`;
    const response = await axios({
      url,
      method: "POST",
      data: userIds,
    });
    if (response.status === 200) {
      const onlineUsers: IUserInfo[] = response.data;
      setOnineUsers(onlineUsers);
    }
  };

  const getNewMessagesSinceDT = async () => {
    setFetchingNewMsg(true);
  };

  useEffect(() => {
    if (useNewMessageData && useNewMessageData.data.length > 0) {
      const { data } = useNewMessageData;
      setMessageHistory([...messageHistory, data[data.length - 1]]);
      setLastFetchMessageDT(data[data.length - 1].createdAt);
      setFetchingNewMsg(false);
    }
  }, [useNewMessageData]);

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
    await axios({
      url: "http://localhost:3001/users/send-message",
      method: "POST",
      withCredentials: true,
      data: {
        message,
        channelId: currentConnection.channelId,
        userId,
        fileIds,
      },
    });
    // socket.emit(
    //   "send",
    //   JSON.stringify({
    //     channelId: currentConnection.channelId,
    //     message,
    //     userId,
    //     fileIds,
    //   })
    // );
  };

  return (
    <Container>
      <Left>
        <ChannelsContainer>
          {userInfo &&
            userInfo.joinedServers.filter(
              (server) => server._id === params.serverId
            )[0]?.channels?.length > 0 &&
            userInfo.joinedServers.filter(
              (server) => server._id === params.serverId
            )[0].channels.length > 0 && (
              <Tree
                data={[
                  {
                    title: <ChannelTypeTitle>Text channels</ChannelTypeTitle>,
                    treeItemRightContent: (
                      <AddIcon
                        onClick={() => setOpenCreateChannelPopup(true)}
                        style={{
                          fontSize: "18px",
                          marginRight: "10px",
                          marginTop: "-6px",
                          color: "rgba(255,255,255,0.6)",
                          cursor: "pointer",
                        }}
                      />
                    ),
                    childs: userInfo.joinedServers
                      .filter((server) => server._id === params.serverId)[0]
                      .channels.map((channel) => {
                        return {
                          title: (
                            <ChannelItem
                              className={
                                currentConnection.channelId == channel._id
                                  ? "selected"
                                  : "not-selected"
                              }
                              onClick={() => handleSelectChannel(channel)}
                              key={channel._id}
                            >
                              <span>#</span>
                              <span>{channel.name}</span>
                            </ChannelItem>
                          ),
                        };
                      }),
                  },
                  {
                    title: <ChannelTypeTitle>Voice channels</ChannelTypeTitle>,
                    childs: [
                      {
                        title: (
                          <ChannelItem
                            className={
                              inVoiceChannel ? "selected" : "not-selected"
                            }
                            onClick={() => {
                              if (!inVoiceChannel) {
                                startVoice(params.serverId);
                              } else {
                                setInVoiceChannel(false);
                              }
                            }}
                          >
                            {inVoiceChannel ? <VolumeUp /> : <VolumeMute />}
                            General
                          </ChannelItem>
                        ),
                      },
                    ],
                  },
                ]}
              />
            )}
        </ChannelsContainer>
      </Left>
      {currentConnection?.channelId && (
        <>
          <ChatHandler
            messageHistory={messageHistory}
            sendMessage={handleSendMessage}
          />
          <OnlineUsersContainer>
            <OnlineTitle>ONLINE - {onlineUsers.length}</OnlineTitle>
            {onlineUsers &&
              onlineUsers.length > 0 &&
              onlineUsers.map((oUser) => (
                <OnlineUserItem key={oUser._id}>
                  <Image
                    src={oUser?.avatar ?? ""}
                    alt="user-avatar"
                    width={40}
                    height={40}
                    style={{
                      borderRadius: "50%",
                      background: "#111111",
                      position: "relative",
                    }}
                  />
                  {oUser.username}
                </OnlineUserItem>
              ))}
          </OnlineUsersContainer>
        </>
      )}
      <Popup
        isOpen={openCreateChannelPopup}
        closePopup={() => setOpenCreateChannelPopup(false)}
      >
        <h1>asddsd</h1>
      </Popup>
    </Container>
  );
}
