"use client";

import AudioItem from "@/components/AudioItem";
import MessageItem from "@/components/MessageItem";
import { SeparateLine } from "@/components/StyledComponents";
import useVoiceChat from "@/hooks/useVoiceChat";
import QUERY_KEY from "@/react-query/consts";
import useFriendsList from "@/react-query/hooks/useFriendsList";
import useP2PMessageHistory from "@/react-query/hooks/useP2PMessageHistory";
import useP2PNewMessages from "@/react-query/hooks/useP2PNewMessages";
import { RootState } from "@/redux/store";
import { FileService } from "@/services/FileService";
import { socket } from "@/services/socket";
import {
  IMessage,
  IUploadFile,
  IUserInfo,
  IUserInfoLite,
} from "@/types/api.type";
import { getBase64FromFile } from "@/utils/file.utils";
import useStore from "@/zustand/useStore";
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
import { VolumeUp, VolumeMute } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import { FastAverageColor } from "fast-average-color";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
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

const MessagesContainer = styled.div`
  width: 100%;
  height: calc(100% - 56px);
  display: flex;
  flex-flow: column wrap;
  background: #313338;
  padding-bottom: 20px;
  position: relative;
`;

const MessagesHolder = styled.div`
  width: calc(100% - 4px);
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 10px;
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
  width: calc(100% - 40px);
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  background: #383a40;
  margin: auto 20px;
  position: relative;
  border-radius: 6px;
  min-height: 40px;
  overflow: hidden;
`;

const MessageHandler = styled.div`
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
  width: 89%;
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
  const dispatch = useDispatch();
  const { userInfo } = useStore();
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const messageHolderRef = useRef<HTMLDivElement | null>(null);
  const [emoId, setEmoId] = useState(1);
  const msgInputRef = useRef<HTMLDivElement | null>(null);
  const [isOpenEmoji, setOpenEmoji] = useState(false);
  const [attachments, setAttachments] = useState<IUploadFile[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
    const targetUserId = searchParams.get("id");
    if (
      socket &&
      msgInputRef &&
      msgInputRef.current &&
      userInfo &&
      targetUserId
    ) {
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
          const response = await FileService.uploadFile({
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
          "sendP2PMessage",
          JSON.stringify({
            message: innerHTML,
            userId: userInfo._id,
            fileIds: fileIds,
            receiverId: targetUserId,
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
      if (messageHolderRef && messageHolderRef.current)
        messageHolderRef.current.scrollTo({
          top: messageHolderRef.current.scrollHeight,
          behavior: "instant",
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
        <MessagesContainer ref={messagesContainerRef}>
          {/* {lastFetchMessageDT && (
              <NewMsgNotify>
                1 new messages since{" "}
                {new Date(lastFetchMessageDT).toDateString()}
              </NewMsgNotify>
            )} */}
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
            <MessageHandler>
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
            </MessageHandler>
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
          <input
            onChange={(e) => onChangeFile(e)}
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
        </MessagesContainer>
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
