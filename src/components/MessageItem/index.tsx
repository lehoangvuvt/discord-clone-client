"use client";

import { IAttachmentResponse, IMessage } from "@/types/api.type";
import Image from "next/image";
import styled from "styled-components";
import AudioItem from "../AudioItem";

const Container = styled.div`
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

const AttachmentsContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
`;

export const AttachmentItem = styled.div`
  flex: 1;
  max-width: 50%;
  height: 150px;
  position: relative;
`;

const MessageItem = ({ data }: { data: IMessage }) => {
  const getAttachmentComponentType = (
    attachment: IAttachmentResponse
  ): React.ReactNode => {
    const fileSrc = attachment.fileDetails.path;
    if (attachment.fileDetails.type.includes("image")) {
      return (
        <AttachmentItem key={attachment._id}>
          <Image
            alt="attachment-img"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            src={fileSrc}
          />
        </AttachmentItem>
      );
    } else if (attachment.fileDetails.type.includes("audio")) {
      return (
        <AttachmentItem
          style={{ height: "auto", maxWidth: "50%" }}
          key={attachment.fileDetails.path}
        >
          <AudioItem url={fileSrc} fileName={attachment.fileDetails.name} />
        </AttachmentItem>
      );
    } else if (attachment.fileDetails.type.includes("video")) {
      return (
        <AttachmentItem
          style={{ height: "auto" }}
          key={attachment.fileDetails.path}
        >
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
        </AttachmentItem>
      );
    }
  };

  return (
    <Container>
      <MessageItemLeft>
        <Image
          src={data.userDetails.avatar}
          alt="user-avatar"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </MessageItemLeft>
      <MessageItemRight>
        <MessageItemRightTop>
          <span>{data.userDetails.name}</span>
          <span>{new Date(data.createdAt).toLocaleString()}</span>
        </MessageItemRightTop>
        <MessageItemRightBottom
          dangerouslySetInnerHTML={{ __html: data.message }}
        />
        <AttachmentsContainer>
          {data.attachments?.length > 0 &&
            data.attachments.map((attachment) =>
              getAttachmentComponentType(attachment.attachmentDetails)
            )}
        </AttachmentsContainer>
      </MessageItemRight>
    </Container>
  );
};

export default MessageItem;
