export type BaseData = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface Server extends BaseData {
  name: string;
  avatar: string;
  creator: string;
}

export interface Channel extends BaseData {
  name: string;
  serverId: string;
}

export interface UserInfo extends BaseData {
  username: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  joinedServers: Server[];
  createdServers: Server[];
}

export interface Message extends BaseData {
  message: string;
  channelId: string;
  userId: string;
  userDetails: UserInfo;
}
