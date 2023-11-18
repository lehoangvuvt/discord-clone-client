import { HttpStatusCode } from "axios";

export type IErrorResponse = {
  errorMessage: string;
  errorCode: HttpStatusCode;
};

export type IApiResponse<T> = {
  data?: T;
  error?: IErrorResponse;
};

export type ILoginData = {
  username: string;
  password: string;
};

export type IRegisterData = {
  username: string;
  password: string;
  name: string;
};

export type IBaseData = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface IServer extends IBaseData {
  name: string;
  avatar: string;
  creator: string;
}

export interface IChannel extends IBaseData {
  name: string;
  serverId: string;
}

export interface IUserInfo extends IBaseData {
  username: string;
  avatar: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  joinedServers: IServer[];
  createdServers: IServer[];
}

export interface IMessage extends IBaseData {
  message: string;
  channelId: string;
  userId: string;
  userDetails: IUserInfo;
  attachments: IMessageAttachment[];
}

export interface IMessageAttachment extends IBaseData {
  messageId: string;
  attachmentId: string;
}

export type IAttachment = {
  name: string;
  type: string;
  buffer: Buffer;
  base64?: string;
};

export interface IAttachmentResponse extends IBaseData {
  name: string;
  type: string;
  buffer: Buffer;
}
