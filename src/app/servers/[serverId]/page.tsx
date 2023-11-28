"use client";

import AudioItem from "@/components/AudioItem";
import MessageItem from "@/components/MessageItem";
import Popup from "@/components/Popup";
import Tree from "@/components/Tree";
import useVoiceChat from "@/hooks/useVoiceChat";
import useChannels from "@/react-query/hooks/useChannels";
import useMessageHistory from "@/react-query/hooks/useMessageHistory";
import useNewMessages from "@/react-query/hooks/useNewMessages";
import { setChannelId } from "@/redux/slices/appSlice";
import { RootState } from "@/redux/store";
import { APIService } from "@/services/ApiService";
import { socket } from "@/services/socket";
import {
  IChannel,
  IGetMessageHistoryResponse,
  IMessage,
  IUploadFile,
  IUserInfo,
} from "@/types/api.type";
import { getBase64FromFile } from "@/utils/file.utils";
import { getRandomInt } from "@/utils/number.utils";
import {
  DeleteFilled,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { VolumeUp, VolumeMute } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
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
import { useDispatch, useSelector } from "react-redux";
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

const MessagesContainer = styled.div`
  width: 68.5%;
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
  padding-top: 40px;
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
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  position: relavite;
  gap: 10px;
  padding-top: 10px;
`;

const UploadItem = styled.div`
  width: 23%;
  height: 150px;
  position: relative;
`;

const UploadItemController = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  background: #2b2d31;
  z-index: 50;
  border-radius: 3px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
  font-size: 20px;
  color: #f50057;
  padding: 5px 10px;
  box-sizing: border-box;
  span {
    cursor: pointer;
    transition: all 0.15s ease;
    filter: brightness(90%);
    &:hover {
      transform: scale(1.1);
      filter: brightness(105%);
    }
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
  const dispatch = useDispatch();
  const currentConnection = useSelector(
    (state: RootState) => state.app.currentConnection
  );
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageHolderRef = useRef<HTMLDivElement | null>(null);
  const [onlineUsers, setOnineUsers] = useState<IUserInfo[]>([]);
  const [emoId, setEmoId] = useState(1);
  const msgInputRef = useRef<HTMLDivElement | null>(null);
  const [isOpenEmoji, setOpenEmoji] = useState(false);
  const [attachments, setAttachments] = useState<IUploadFile[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openCreateChannelPopup, setOpenCreateChannelPopup] = useState(false);
  const { channels, isLoading: loadingChannels } = useChannels(params.serverId);
  const { data: useMessageHistoryData } = useMessageHistory(
    currentConnection.channelId,
    currentPage,
    20
  );
  const {
    start: startVoice,
    stop: stopVoice,
    inVoiceChannel,
    setInVoiceChannel,
  } = useVoiceChat(socket);
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
    return () => {
      stopVoice(params.serverId);
    };
  }, []);

  useEffect(() => {
    if (msgInputRef && msgInputRef.current) {
      msgInputRef.current.innerHTML = "";
    }
    if (userInfo && currentConnection.channelId) {
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
    if (currentConnection.channelId) {
      const channelId = currentConnection.channelId;
      socket.off("joinedChannel", handleJoinedChannel);
      socket.off(`receiveOnlineChannel=${channelId}`, getUsersByIds);
      setMessageHistory([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  useEffect(() => {
    setMessageHistory([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [currentConnection.server]);

  const handleJoinedChannel = (channelId: string) => {
    socket.on(`receiveOnlineChannel=${channelId}`, getUsersByIds);
  };

  useEffect(() => {
    if (lastFetchMessageDT && currentConnection.channelId) {
      socket.on(
        `receiveMessageChannel=${currentConnection.channelId}`,
        getNewMessagesSinceDT
      );
      return () => {
        socket.off(
          `receiveMessageChannel=${currentConnection.channelId}`,
          getNewMessagesSinceDT
        );
      };
    }
  }, [lastFetchMessageDT, currentConnection.channelId]);

  const handleSelectChannel = async (channel: IChannel) => {
    setAttachments([]);
    setMessageHistory([]);
    setOnineUsers([]);
    dispatch(setChannelId(channel._id));
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
      setMessageHistory([...messageHistory, ...data]);
      setLastFetchMessageDT(data[data.length - 1].createdAt);
      setFetchingNewMsg(false);
    }
  }, [useNewMessageData]);

  useEffect(() => {
    if (useMessageHistoryData) {
      const { currentPage, data, hasMore, totalPage } = useMessageHistoryData;
      if (data.length > 0) {
        const msgHistory = [...data, ...messageHistory];
        setMessageHistory(msgHistory);
        setHasMore(hasMore);
        setLastFetchMessageDT(msgHistory[msgHistory.length - 1].createdAt);
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

  const handleScroll = (e: any) => {
    if (messageHolderRef && messageHolderRef.current) {
      if (messageHolderRef.current.scrollTop === 0) {
        setCurrentPage((value) => value + 1);
      }
    }
  };

  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLDivElement>
  ) => {
    if (socket && msgInputRef && msgInputRef.current && userInfo) {
      let innerHTML = msgInputRef.current.innerHTML;
      let isValidMsg = true;
      if ((innerHTML + "").length === 0 && attachments.length === 0) {
        isValidMsg = false;
      }

      if (isValidMsg) {
        if ((innerHTML + "").length === 0) {
          innerHTML = "<span></span>";
        }
        let fileIds: string[] = [];
        const uploadFiles = attachments.map(async (attachment) => {
          const response = await APIService.uploadFile({
            base64: attachment.base64,
            name: attachment.name,
            section: attachment.section,
            type: attachment.type,
          });
          if (response.status === "Success") {
            fileIds.push(response.data._id);
          }
        });
        await Promise.all(uploadFiles);
        socket.emit(
          "send",
          JSON.stringify({
            channelId: currentConnection.channelId,
            message: innerHTML,
            userId: userInfo._id,
            fileIds: fileIds,
          })
        );
        setAttachments([]);
        msgInputRef.current.innerHTML = "";
      } else {
        alert("Please input message");
      }
    }
    e.preventDefault();
  };

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      // if (messageHolderRef && messageHolderRef.current)
      //   messageHolderRef.current.scrollTo({
      //     top: messageHolderRef.current.scrollHeight,
      //     behavior: "smooth",
      //   });
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
        const name = e.target!.files![0].name;
        const attachment: IUploadFile = {
          name,
          type,
          base64,
          section: "attachment",
        };
        setAttachments((value) => [...value, attachment]);
      }
    });
  };

  const getUploadFileTypeComponent = (
    uploadFile: IUploadFile
  ): React.ReactNode => {
    const fileSrc = uploadFile.base64;
    if (uploadFile.type.includes("image")) {
      return (
        <UploadItem key={uploadFile.name}>
          <UploadItemController>
            <DeleteFilled
              onClick={() =>
                setAttachments((currentValues) =>
                  currentValues.filter(
                    (value) => value.name !== uploadFile.name
                  )
                )
              }
            />
          </UploadItemController>
          <Image
            alt="attachment-img"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            src={fileSrc}
          />
        </UploadItem>
      );
    } else if (uploadFile.type.includes("audio")) {
      return (
        <UploadItem
          style={{
            position: "relative",
            width: "335px",
            display: "flex",
          }}
          key={uploadFile.name}
        >
          <UploadItemController>
            <DeleteFilled
              onClick={() =>
                setAttachments((currentValues) =>
                  currentValues.filter(
                    (value) => value.name !== uploadFile.name
                  )
                )
              }
            />
          </UploadItemController>
          <AudioItem
            style={{ color: "white" }}
            url={fileSrc}
            fileName={uploadFile.name}
          />
        </UploadItem>
      );
    } else if (uploadFile.type.includes("video")) {
      return (
        <UploadItem key={uploadFile.name}>
          <UploadItemController>
            <DeleteFilled
              onClick={() =>
                setAttachments((currentValues) =>
                  currentValues.filter(
                    (value) => value.name !== uploadFile.name
                  )
                )
              }
            />
          </UploadItemController>
          <video
            style={{
              width: "100%",
              marginTop: "5px",
              marginBottom: "5px",
            }}
            autoPlay={false}
            src={fileSrc}
            controls
          />
        </UploadItem>
      );
    }
  };

  return (
    <Container>
      <Left>
        <ChannelsContainer>
          {!loadingChannels && channels && (
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
                        marginTop: "2px",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                      }}
                    />
                  ),
                  childs: channels.map((channel) => {
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
          <MessagesContainer ref={messagesContainerRef}>
            {lastFetchMessageDT && (
              <NewMsgNotify>
                1 new messages since{" "}
                {new Date(lastFetchMessageDT).toDateString()}
              </NewMsgNotify>
            )}
            <MessagesHolder onScroll={handleScroll} ref={messageHolderRef}>
              {messageHistory &&
                messageHistory.length > 0 &&
                messageHistory.map((message, i) => (
                  <MessageItem key={message._id} data={message} />
                ))}
            </MessagesHolder>

            <MessageEditor onSubmit={handleSendMessage}>
              {attachments?.length > 0 && (
                <FilesContainer>
                  {attachments.map((attachment, i) =>
                    getUploadFileTypeComponent(attachment)
                  )}
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
          <input
            onChange={(e) => onChangeFile(e)}
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
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
