import { HttpStatusCode } from "axios";

export enum RelationshipTypeEnum {
  FRIEND = "FRIEND",
  PENDING_REQUEST = "PENDING_REQUEST",
  BLOCK_FIRST_SECOND = "BLOCK_FIRST_SECOND",
  BLOCK_SECOND_FIRST = "BLOCK_SECOND_FIRST",
  DECLINE = "DECLINE",
}

export type IApiResponseSuccess<T> = {
  status: "Success";
  statusCode: HttpStatusCode;
  data: T;
};

export type IApiResponseError<E> = {
  status: "Error";
  errorMessage: E;
  errorCode: HttpStatusCode;
};

export type IApiResponse<T, E> = IApiResponseSuccess<T> | IApiResponseError<E>;

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
  joinedServers: IServerInfo[];
  createdServers: IServerInfo[];
}

export interface IUserInfoLite extends IBaseData {
  username: string;
  avatar: string;
  name: string;
}

export type IUpdateUserInfo = {
  avatar: string;
  name: string;
};

export type ICreateServerData = {
  avatar: string;
  name: string;
};

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
  attachmentDetails: IAttachmentResponse;
}

export type IAttachment = {
  fileId: string;
};

export interface IAttachmentResponse extends IBaseData {
  fileId: string;
  fileDetails: IUploadFileResponse;
}

export type IUploadFile = {
  name: string;
  type: string;
  base64: string;
  section: string;
};

export interface IUploadFileResponse extends IBaseData {
  name: string;
  type: string;
  section: string;
  path: string;
}

export type IGetMessageHistoryResponse = {
  totalPage: number;
  currentPage: number;
  hasMore: boolean;
  data: IMessage[];
};

export interface IUserServer extends IBaseData {
  userId: string;
  serverId: string;
}

export interface IServerInfo extends IServer {
  channels: IChannel[];
}

export interface IServerInvitation extends IBaseData {
  serverId: string;
  expiredAt: string;
  limit: number;
  used_count: number;
  invitation_short_id: string;
  createdBy: string;
}

export interface IServerInvitationDetails extends IServerInvitation {
  serverDetails: IServer;
  creator: IUserInfoLite;
  isExpired: boolean;
}

export interface IUserRelationship extends IBaseData {
  userFirstId: string;
  userSecondId: string;
  type: string;
}

export interface IActivity extends IBaseData {
  actor_id: string;
  object_id: string;
  verb: string;
  isRead: boolean;
}

export type SendFriendRequestErrorReasonEnum =
  | "NOT_FOUND"
  | "FAILED"
  | "RECEIVED_FROM_TARGET"
  | "ALREADY_FRIEND"
  | "BLOCKED_FROM_TARGET"
  | "YOURSELF"
  | "ALREADY_SENT";

export type ISendFriendRequestResponse =
  | {
      status: "Success";
      targetUser: IUserInfoLite;
      result: IUserRelationship;
    }
  | {
      status: "Error";
      reason: SendFriendRequestErrorReasonEnum;
    };

export type IGetUserPendingRequestsReponse = {
  receiveFromUsers: { user: IUserInfoLite; request: IUserRelationship }[];
  sentToUsers: { user: IUserInfoLite; request: IUserRelationship }[];
};

export type IUseServerInvitationResponse =
  | {
      status: "Success";
    }
  | {
      status: "Error";
      errorMsg: string;
    };

export enum ActivityVerbEnum {
  ADD_FRIEND = "ADD_FRIEND",
  INVITE_TO_SERVER = "INVITE_TO_SERVER",
  MENTION = "MENTION",
  NEW_MESSAGE_P2P = "NEW_MESSAGE_P2P",
  NEW_MESSAGE_CHANNEL = "NEW_MESSAGE_CHANNEL",
}
