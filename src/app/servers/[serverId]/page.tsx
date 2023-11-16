"use client";

import { RootState } from "@/redux/store";
import { socket } from "@/services/socket";
import { Channel, Message, UserInfo } from "@/types/api.type";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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

const ChannelsContainer = styled.div`
  width: 18%;
  height: 100%;
  background: #2b2d31;
  color: white;
  padding-top: 20px;
`;

const ChannelItem = styled.div`
  flex: 1;
  color: white;
  font-weight: 500;
  box-sizing: border-box;
  font-size: 14px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 4px;
  span:nth-child(1) {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 5px;
    font-size: 20px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const MessagesContainer = styled.div`
  width: 69%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  background: #313338;
`;

const MessagesHolder = styled.div`
  width: calc(100% - 5px);
  margin-top: 5px;
  height: 88%;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 10px;
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

const MessageEditor = styled.form`
  width: 95%;
  height: 40px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background: #383a40;
  margin: auto auto;
  border-radius: 6px;
`;

const MessageInput = styled.input`
  width: 80%;
  height: 100%;
  outline: none;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  background: none;
  padding-left: 10px;
  box-sizing: border-box;
  margin-left: 20px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const MessageItem = styled.div`
  width: 100%;
  padding: 20px 10px;
  color: white;
  font-weight: 300;
  display: flex;
  flex-flow: row wrap;
  box-sizing: border-box;
`;

const MessageItemLeft = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  background: #111111;
  box-sizing: border-box;
`;

const MessageItemRight = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  padding-left: 10px;
  box-sizing: border-box;
`;

const MessageItemRightTop = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 10px;
  span:nth-child(1) {
    color: #d3672b;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  span:nth-child(2) {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    font-size: 12px;
  }
`;

const MessageItemRightBottom = styled.div`
  margin-top: 5px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.25;
  img {
    max-width: 100%;
    max-height: 200px;
    margin-top: 5px;
    margin-right: 10px;
  }
`;

const OnlineUsersContainer = styled.div`
  width: 13%;
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

export default function Server({ params }: { params: any }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState("");
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const messageHolderRef = useRef<HTMLDivElement | null>(null);
  const [onlineUsers, setOnineUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    getServerChannels();
  }, []);

  const getServerChannels = async () => {
    if (params.serverId !== "%40me") {
      const response = await axios({
        url: `https://server-discord-clone.adaptable.app/servers/get-channels/${params.serverId}`,
        method: "GET",
      });
      const channels: Channel[] = response.data;
      setChannels(channels);
    }
  };

  const handleSelectChannel = async (channel: Channel) => {
    if (userInfo) {
      const data = {
        _id: userInfo._id,
        channelId: channel._id,
      };
      if (socket) {
        getMessageHistory(channel._id);
        socket.emit("joinChannel", JSON.stringify(data));
        socket.on("joinedChannel", (channelId) => {
          setCurrentChannelId(channelId);
          socket.on(`receiveMessageChannel=${channelId}`, (message: string) => {
            getMessageHistory(channelId);
          });
          socket.on(`receiveOnlineChannel=${channelId}`, (data: string) => {
            const userIds = JSON.parse(data);
            getUsersByIds(userIds);
          });
        });
      }
    }
  };

  const getUsersByIds = async (userIds: string[]) => {
    const url = "https://server-discord-clone.adaptable.app/users/get-users-by-ids";
    const response = await axios({
      url,
      method: "POST",
      data: userIds,
    });
    if (response.status === 200) {
      const onlineUsers: UserInfo[] = response.data;
      setOnineUsers(onlineUsers);
    }
  };

  const getMessageHistory = async (channelId: string) => {
    const response = await axios({
      url: `https://server-discord-clone.adaptable.app/channels/message-history/${channelId}`,
    });
    if (response.status === 200) {
      const messageHistory: Message[] = response.data;
      setMessageHistory(messageHistory);
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    if (socket && message?.length > 0 && userInfo) {
      socket.emit(
        "send",
        JSON.stringify({
          channelId: currentChannelId,
          message,
          userId: userInfo._id,
        })
      );
      setMessage("");
    }
    e.preventDefault();
  };

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      if (messageHolderRef && messageHolderRef.current)
        messageHolderRef.current.scrollTo({
          top: messageHolderRef.current.scrollHeight,
          behavior: "smooth",
        });
    }
  }, [messageHistory]);

  return (
    <Container>
      <ChannelsContainer>
        {channels &&
          channels.length > 0 &&
          channels.map((channel) => (
            <ChannelItem
              className={
                currentChannelId == channel._id ? "selected" : "not-selected"
              }
              onClick={() => handleSelectChannel(channel)}
              key={channel._id}
            >
              <span>#</span>
              <span>{channel.name}</span>
            </ChannelItem>
          ))}
      </ChannelsContainer>
      {currentChannelId && (
        <>
          <MessagesContainer>
            <MessagesHolder ref={messageHolderRef}>
              {messageHistory &&
                messageHistory.length > 0 &&
                messageHistory.map((message, i) => (
                  <MessageItem key={i}>
                    <MessageItemLeft>
                      <Image
                        src={message.userDetails.avatar}
                        alt="user-avatar"
                        fill
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    </MessageItemLeft>
                    <MessageItemRight>
                      <MessageItemRightTop>
                        <span>{message.userDetails.username}</span>
                        <span>
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </MessageItemRightTop>
                      <MessageItemRightBottom
                        dangerouslySetInnerHTML={{ __html: message.message }}
                      />
                    </MessageItemRight>
                  </MessageItem>
                ))}
            </MessagesHolder>
            <MessageEditor onSubmit={handleSendMessage}>
              <MessageInput
                placeholder="Message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <input style={{ display: "none" }} type="submit" value="Send" />
            </MessageEditor>
          </MessagesContainer>
          <OnlineUsersContainer>
            <OnlineTitle>ONLINE - {onlineUsers.length}</OnlineTitle>
            {onlineUsers &&
              onlineUsers.length > 0 &&
              onlineUsers.map((oUser) => (
                <OnlineUserItem key={oUser._id}>
                  <Image
                    src={oUser.avatar}
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
    </Container>
  );
}
