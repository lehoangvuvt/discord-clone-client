import {
  ILoginData,
  IUserInfo,
  IApiResponse,
  IRegisterData,
  IAttachment,
  IAttachmentResponse,
  IUploadFile,
  IUploadFileResponse,
  IUpdateUserInfo,
  ICreateServerData,
  IServer,
  IMessage,
  IGetMessageHistoryResponse,
  IChannel,
  IUserServer,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const APIService = {
  async login(data: ILoginData): Promise<IApiResponse<IUserInfo>> {
    try {
      const response = await baseAxios.post<
        ILoginData,
        AxiosResponse<IUserInfo>
      >("/users/login", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Wrong username or password",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Wrong username or password",
      };
    }
  },
  async register(data: IRegisterData): Promise<IApiResponse<IUserInfo>> {
    const response = await baseAxios.post<
      IRegisterData,
      AxiosResponse<IUserInfo>
    >("/users/register", data);
    if (response.status === 200) {
      return {
        status: "Success",
        statusCode: 200,
        data: response.data,
      };
    } else {
      return {
        status: "Error",
        errorCode: response.status,
        errorMessage: "Cannot register",
      };
    }
  },
  async uploadFile(
    data: IUploadFile
  ): Promise<IApiResponse<IUploadFileResponse>> {
    const response = await baseAxios.post<
      IUploadFile,
      AxiosResponse<IUploadFileResponse>
    >("/files/upload", data);
    if (response.status === 200) {
      return {
        status: "Success",
        data: response.data,
        statusCode: response.status,
      };
    } else {
      return {
        status: "Error",
        errorCode: response.status,
        errorMessage: `Cannot upload file ${data.name}`,
      };
    }
  },
  async getAttachment(
    attachmentId: string
  ): Promise<IApiResponse<IAttachmentResponse>> {
    const response = await baseAxios.get<
      IAttachment,
      AxiosResponse<IAttachmentResponse>
    >(`/attachments/${attachmentId}`);
    if (response.status === 200) {
      return {
        status: "Success",
        data: response.data,
        statusCode: response.status,
      };
    } else {
      return {
        status: "Error",
        errorCode: response.status,
        errorMessage: `Cannot get attachment ${attachmentId}`,
      };
    }
  },
  async athentication(): Promise<IApiResponse<IUserInfo>> {
    try {
      const response = await baseAxios.get<null, AxiosResponse<IUserInfo>>(
        `/users/authentication`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Athentication failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 401,
        errorMessage: "Athentication failed",
      };
    }
  },
  async getAccessTokenByRefreshToken(): Promise<IApiResponse<IUserInfo>> {
    try {
      const response = await baseAxios.get<null, AxiosResponse<IUserInfo>>(
        `/users/refresh-token`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Get access token failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 401,
        errorMessage: "Get access token failed",
      };
    }
  },
  async updateUserInfo(
    userInfo: IUpdateUserInfo
  ): Promise<IApiResponse<IUserInfo>> {
    try {
      const response = await baseAxios.post<null, AxiosResponse<IUserInfo>>(
        `/users/update`,
        userInfo,
        { withCredentials: true }
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Update user info failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Update user info failed",
      };
    }
  },
  async createServer(data: ICreateServerData): Promise<IApiResponse<IServer>> {
    try {
      const response = await baseAxios.post<
        ICreateServerData,
        AxiosResponse<IServer>
      >(`/servers/create`, data, { withCredentials: true });
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Create server failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Create server failed",
      };
    }
  },
  async getMessageHistory(
    channelId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<IApiResponse<IGetMessageHistoryResponse>> {
    try {
      const response = await baseAxios.get<
        null,
        AxiosResponse<IGetMessageHistoryResponse>
      >(
        `/channels/message-history/channelId=${channelId}&page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Get message history failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Get message history failed",
      };
    }
  },
  async getNewMessagesSinceDT(
    channelId: string,
    datetime: string
  ): Promise<IApiResponse<IGetMessageHistoryResponse>> {
    try {
      const response = await baseAxios.get<
        null,
        AxiosResponse<IGetMessageHistoryResponse>
      >(`/channels/new-messages/channelId=${channelId}&datetime=${datetime}`);
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Get message history failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Get message history failed",
      };
    }
  },
  async getServerChannels(serverId: string): Promise<IApiResponse<IChannel[]>> {
    try {
      const response = await baseAxios.get<null, AxiosResponse<IChannel[]>>(
        `/servers/get-channels/${serverId}`
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Get server channels failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Get server channels failed",
      };
    }
  },
  async leaveServer(serverId: string): Promise<IApiResponse<IUserServer>> {
    try {
      const response = await baseAxios.delete<null, AxiosResponse<IUserServer>>(
        `/servers/leave/serverId=${serverId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "Leave server failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "Leave server failed",
      };
    }
  },
};
