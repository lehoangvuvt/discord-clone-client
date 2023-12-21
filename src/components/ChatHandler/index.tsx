"use client";

import PropagateLoader from "react-spinners/PropagateLoader";
import { socket } from "@/services/socket";
import { IMessage, IUploadFile } from "@/types/api.type";
import useStore from "@/zustand/useStore";
import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import MessageItem from "../MessageItem";
import { FileService } from "@/services/FileService";
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
import AudioItem from "../AudioItem";
import { getBase64FromFile } from "@/utils/file.utils";

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
  box-sizing: border-box;
  padding: 0px 7px 5px 7px;
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

type Props = {
  messageHistory: IMessage[];
  isLoading: boolean;
  sendMessage: (
    message: string,
    fileIds: string[],
    userId: string
  ) => Promise<any>;
  style?: React.CSSProperties;
};

const ChatHandler = ({
  messageHistory,
  sendMessage,
  isLoading,
  style,
}: Props) => {
  const { currentConnection, setChannelId, userInfo } = useStore();
  const messageHolderRef = useRef<HTMLDivElement | null>(null);
  const [emoId, setEmoId] = useState(1);
  const msgInputRef = useRef<HTMLDivElement | null>(null);
  const [isOpenEmoji, setOpenEmoji] = useState(false);
  const [attachments, setAttachments] = useState<IUploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOnClickEmoji = (emojiId: number) => {
    if (msgInputRef && msgInputRef.current) {
      const spanImage = `<img style="width: 18px; height: 18px; margin-left: 2px; margin-right: 2px;" src='/images/emoji/icon (${emojiId}).png'/>`;
      msgInputRef.current.innerHTML += spanImage;
      setOpenEmoji(false);
    }
  };

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
        sendMessage(innerHTML, fileIds, userInfo._id);
        setAttachments([]);
        msgInputRef.current.innerHTML = "";
      } else {
        alert("Please input message");
      }
    }
    e.preventDefault();
  };

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

  useEffect(() => {
    if (messageHistory && messageHistory.length > 0) {
      if (messageHolderRef && messageHolderRef.current)
        messageHolderRef.current.scrollTo({
          top: messageHolderRef.current.scrollHeight,
          behavior: "instant",
        });
    }
  }, [messageHistory]);

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

  return (
    <MessagesContainer style={style}>
      <MessagesHolder onScroll={handleScroll} ref={messageHolderRef}>
        {isLoading && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <PropagateLoader
              color={"#5865f2"}
              loading={true}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}

        {!isLoading &&
          messageHistory &&
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
      <input
        onChange={(e) => onChangeFile(e)}
        style={{ display: "none" }}
        type="file"
        name="file"
        id="file"
      />
    </MessagesContainer>
  );
};

export default ChatHandler;
