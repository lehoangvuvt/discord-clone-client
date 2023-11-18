"use client";

import { IAttachmentResponse, IMessage } from "@/types/api.type";
import Image from "next/image";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { APIService } from "@/services/ApiService";

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

const AttachmentItem = styled.div`
  width: 20%;
  height: 150px;
  position: relative;
`;

const MessageItem = ({ data }: { data: IMessage }) => {
  const [attachments, setAttachments] = useState<IAttachmentResponse[]>([]);

  useEffect(() => {
    if (data.attachments?.length > 0) {
      getAttachment();
    }
  }, []);

  const getAttachment = async () => {
    const attachments: IAttachmentResponse[] = [];
    const getAttachments = data.attachments.map(async (attachment) => {
      const response = await APIService.getAttachment(attachment.attachmentId);
      if (response.data) {
        attachments.push(response.data);
      }
    });
    await Promise.all(getAttachments);
    if (attachments && attachments.length > 0) {
      setAttachments(attachments);
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
          <span>{data.userDetails.username}</span>
          <span>{new Date(data.createdAt).toLocaleString()}</span>
        </MessageItemRightTop>
        <MessageItemRightBottom
          dangerouslySetInnerHTML={{ __html: data.message }}
        />
        <AttachmentsContainer>
          {attachments?.length > 0 &&
            attachments.map((attachment) => (
              <AttachmentItem key={attachment._id}>
                <Image
                  alt="attachment-img"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  src={`${attachment.type},${attachment.buffer.toString(
                    "base64"
                  )}`}
                />
              </AttachmentItem>
            ))}
        </AttachmentsContainer>
      </MessageItemRight>
    </Container>
  );
};

export default MessageItem;
