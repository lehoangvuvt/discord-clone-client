"use client";

import MessageItem from "@/components/MessageItem";
import { RootState } from "@/redux/store";
import { APIService } from "@/services/ApiService";
import { socket } from "@/services/socket";
import { IAttachment, IChannel, IMessage, IUserInfo } from "@/types/api.type";
import { getBase64FromFile } from "@/utils/file.utils";
import { getRandomInt } from "@/utils/number.utils";
import { PlusCircleFilled, SmileOutlined } from "@ant-design/icons";
import axios from "axios";
import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  padding-bottom: 20px;
  position: relative;
`;

const MessagesHolder = styled.div`
  width: calc(100% - 5px);
  margin-top: 5px;
  flex: 1;
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
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  background: #383a40;
  margin: auto auto;
  position: relative;
  border-radius: 6px;
  min-height: 40px;
  overflow: hidden;
  padding-bottom: 10px;
`;

const MessageHanlder = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const MessageInput = styled.div`
  -moz-appearance: textfield-multiline;
  -webkit-appearance: textarea;
  border: 1px solid gray;
  font: medium -moz-fixed;
  font: -webkit-small-control;
  overflow: hidden;
  padding: 2px;
  resize: none;
  width: 80%;
  color: rgba(255, 255, 255, 0.75);
  top: 0;
  max-height: 100px;
  min-height: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  padding-right: 10px;
  margin-top: 4px;
`;

const EmojiSelector = styled.div<{ $isOpenEmoji: boolean }>`
  filter: ${(props) =>
    props.$isOpenEmoji ? "grayscale(0%)" : "grayscale(100%)"};
  transform: ${(props) => (props.$isOpenEmoji ? "scale(1.15)" : "scale(1)")};
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  margin-top: 5px;
  transition: all 0.1s ease;
  &:hover {
    filter: grayscale(0%);
    transform: scale(1.15);
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

const EmojiesPopup = styled.div`
  position: absolute;
  right: 2.5%;
  bottom: 70px;
  width: 273px;
  background: #2b2d31;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  z-index: 100;
  img {
    padding: 5px;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`;

const AddFileContainer = styled.label`
  width: 50px;
  height: 100%;
  margin-top: -5px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 21px;
  cursor: pointer;
  padding-top: 9.5px;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const FilesContainer = styled.div`
  width: 100%;
  height: 220px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  gap: 10px;
  position: relavite;
`;

const FileItem = styled.div`
  width: 230px;
  height: 200px;
  background: #2b2d31;
  border-radius: 4px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  padding-top: 10px;
`;

const FileImageContainer = styled.div`
  width: 92%;
  height: 70%;
  margin-top: 7%;
  position: relative;
`;

const FileName = styled.div`
  width: 100%;
  flex: 1;
  font-weight: 200;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5px;
  max-width: 30ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis !important;
`;

export default function Server({ params }: { params: any }) {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState("");
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageHolderRef = useRef<HTMLDivElement | null>(null);
  const [onlineUsers, setOnineUsers] = useState<IUserInfo[]>([]);
  const [emoId, setEmoId] = useState(1);
  const msgInputRef = useRef<HTMLDivElement | null>(null);
  const [isOpenEmoji, setOpenEmoji] = useState(false);
  const [attachments, setAttachments] = useState<IAttachment[]>([]);

  useEffect(() => {
    getServerChannels();
    setEmoId(getRandomInt(1, 16));
  }, []);

  const getServerChannels = async () => {
    if (params.serverId !== "%40me") {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/servers/get-channels/${params.serverId}`,
        method: "GET",
      });
      const channels: IChannel[] = response.data;
      setChannels(channels);
    }
  };

  const handleSelectChannel = async (channel: IChannel) => {
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

  const getMessageHistory = async (channelId: string) => {
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/channels/message-history/${channelId}`,
    });
    if (response.status === 200) {
      const messageHistory: IMessage[] = response.data;
      setMessageHistory(messageHistory);
    }
  };

  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLDivElement>
  ) => {
    if (socket && msgInputRef && msgInputRef.current && userInfo) {
      const innerHTML = msgInputRef.current.innerHTML;
      const attachmentsWithoutBase64: IAttachment[] = attachments.map(
        (attachment) => {
          const { buffer, name, type } = attachment;
          return {
            buffer,
            name,
            type,
          };
        }
      );
      let attachmentIds: string[] = [];
      const uploadAttachments = attachmentsWithoutBase64.map(
        async (attachment) => {
          const response = await APIService.uploadAttachment(attachment);
          if (response.data) {
            attachmentIds.push(response.data._id);
          }
        }
      );
      await Promise.all(uploadAttachments);
      socket.emit(
        "send",
        JSON.stringify({
          channelId: currentChannelId,
          message: innerHTML,
          userId: userInfo._id,
          attachmentIds: attachmentIds,
        })
      );
      setAttachments([]);
      msgInputRef.current.innerHTML = "";
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

  const handleChangeEditable = (e: FormEvent<HTMLElement>) => {
    if (msgInputRef && msgInputRef.current) {
      if (e.currentTarget.textContent) {
        let content = e.currentTarget.textContent;
        msgInputRef.current.innerHTML = content;
      } else {
        msgInputRef.current.innerHTML = "";
      }
    }
  };

  const handleOnClickEmoji = (emojiId: number) => {
    if (msgInputRef && msgInputRef.current) {
      const spanImage = `<img style="width: 18px; height: 18px; margin-left: 2px; margin-right: 2px;" src='/images/emoji/icon (${emojiId}).png'/>`;
      msgInputRef.current.innerHTML += spanImage;
      setOpenEmoji(false);
    }
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    getBase64FromFile(e.target.files[0], (base64: string | null) => {
      if (base64 !== null) {
        const type = base64.split(",")[0];
        const content = base64.split(",")[1];
        const name = e.target!.files![0].name;
        const buffer = Buffer.from(content, "base64");
        const attachment: IAttachment = {
          buffer,
          name,
          type,
          base64,
        };
        setAttachments((value) => [...value, attachment]);
      }
    });
  };

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
                  <MessageItem key={message._id} data={message} />
                ))}
            </MessagesHolder>

            <MessageEditor onSubmit={handleSendMessage}>
              {attachments?.length > 0 && (
                <FilesContainer>
                  {attachments.map((attachment, i) => (
                    <FileItem key={i}>
                      <FileImageContainer>
                        <Image
                          fill
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          alt="file-upload-img"
                          src={attachment.base64 ?? ""}
                        />
                      </FileImageContainer>
                      <FileName>{attachment.name}</FileName>
                    </FileItem>
                  ))}
                </FilesContainer>
              )}
              <MessageHanlder>
                <AddFileContainer htmlFor="file">
                  <PlusCircleFilled />
                </AddFileContainer>
                <MessageInput
                  contentEditable
                  ref={msgInputRef}
                  onBlur={handleChangeEditable}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      handleSendMessage(e);
                    }
                  }}
                />
                <input style={{ display: "none" }} type="submit" value="Send" />
                <EmojiSelector $isOpenEmoji={isOpenEmoji}>
                  <Image
                    onClick={() => setOpenEmoji(!isOpenEmoji)}
                    src={`/images/emoji/icon (${emoId}).png`}
                    alt="emoji-icon"
                    width={26}
                    height={26}
                  />
                </EmojiSelector>
              </MessageHanlder>
            </MessageEditor>
            {isOpenEmoji && (
              <EmojiesPopup>
                {Array(16)
                  .fill("")
                  .map((_, i) => (
                    <Image
                      key={i}
                      width={45}
                      height={45}
                      alt={`emo-icon-${i + 1}`}
                      src={`/images/emoji/icon (${i + 1}).png`}
                      onClick={() => handleOnClickEmoji(i + 1)}
                    />
                  ))}
              </EmojiesPopup>
            )}
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
          <input
            onChange={(e) => onChangeFile(e)}
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
        </>
      )}
    </Container>
  );
}
