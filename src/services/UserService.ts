import {
  ILoginData,
  IUserInfo,
  IApiResponse,
  IRegisterData,
  IUploadFile,
  IUploadFileResponse,
  IUpdateUserInfo,
  IUserInfoLite,
  ISendFriendRequestResponse,
  IGetUserPendingRequestsReponse,
  SendFriendRequestErrorReasonEnum,
  RelationshipTypeEnum,
  IUserRelationship,
  IGetMessageHistoryResponse,
  IActivity,
  ActivityVerbEnum,
  IMessage,
  IPendingRegister,
  IVerifyOTPRes,
  VerifyErrorTypeEnum,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const UserService = {
  async login(data: ILoginData): Promise<IApiResponse<IUserInfo, string>> {
    try {
      const response = await baseAxios<ILoginData, AxiosResponse<IUserInfo>>({
        url: "/users/login",
        data,
        method: "POST",
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
  async register(
    data: IRegisterData
  ): Promise<IApiResponse<IPendingRegister, string>> {
    const response = await baseAxios<
      IRegisterData,
      AxiosResponse<IPendingRegister>
    >({
      method: "POST",
      url: "/users/register",
      data,
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
        errorMessage: "Cannot register",
      };
    }
  },
  async uploadFile(
    data: IUploadFile
  ): Promise<IApiResponse<IUploadFileResponse, string>> {
    const response = await baseAxios<
      IUploadFile,
      AxiosResponse<IUploadFileResponse>
    >({
      method: "POST",
      url: "/files/upload",
      data,
      withCredentials: true,
    });
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
  async athentication(): Promise<IApiResponse<IUserInfo, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IUserInfo>>({
        method: "GET",
        url: `/users/authentication`,
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
  async loginByRefreshToken(): Promise<IApiResponse<IUserInfo, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IUserInfo>>({
        url: `/users/refresh-token`,
        method: "GET",
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
          errorMessage: "Login by refresh token failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 401,
        errorMessage: "Login by refresh token failed",
      };
    }
  },
  async updateUserInfo(
    userInfo: IUpdateUserInfo
  ): Promise<IApiResponse<IUserInfo, string>> {
    try {
      const response = await baseAxios<
        IUpdateUserInfo,
        AxiosResponse<IUserInfo>
      >({
        url: `/users/update`,
        method: "POST",
        data: userInfo,
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
  async getFriendsList(): Promise<IApiResponse<IUserInfoLite[], string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IUserInfoLite[]>>({
        url: `/users/friends`,
        method: "GET",
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
          errorMessage: "getFriendsList failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getFriendsList failed",
      };
    }
  },
  async getUserPendingRequests(): Promise<
    IApiResponse<IGetUserPendingRequestsReponse, string>
  > {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<IGetUserPendingRequestsReponse>
      >({
        url: `/users/pending-requests`,
        method: "GET",
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
          errorMessage: "getUserPendingRequests failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getUserPendingRequests failed",
      };
    }
  },
  async sendFriendRequest(
    targetUsername: string
  ): Promise<
    IApiResponse<ISendFriendRequestResponse, SendFriendRequestErrorReasonEnum>
  > {
    try {
      const response = await baseAxios<
        { targetUsername: string },
        AxiosResponse<ISendFriendRequestResponse>
      >({
        method: "POST",
        url: `/users/send-friend-request`,
        data: {
          targetUsername,
        },
        withCredentials: true,
      });
      if (response.data.status === "Success") {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: response.data.reason,
        };
      }
    } catch (e: any) {
      return {
        status: "Error",
        errorCode: e.response.status,
        errorMessage: e.response.data.error,
      };
    }
  },
  async logout(): Promise<IApiResponse<{ message: string }, string>> {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<{ message: string }>
      >({ url: `/users/logout`, method: "GET", withCredentials: true });
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
          errorMessage: "logout failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "logout failed",
      };
    }
  },
  async handleFriendRequest(
    requestId: string,
    relationshipType: RelationshipTypeEnum
  ): Promise<IApiResponse<IUserRelationship, string>> {
    try {
      const response = await baseAxios<
        { requestId: string; relationshipType: RelationshipTypeEnum },
        AxiosResponse<IUserRelationship>
      >({
        url: `/users/handle-friend-request`,
        method: "POST",
        data: { requestId, relationshipType },
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
          errorMessage: "handleFriendRequest failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "handleFriendRequest failed",
      };
    }
  },
  async getP2PMessageHistory(
    targetUserId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<IApiResponse<IGetMessageHistoryResponse, string>> {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<IGetMessageHistoryResponse>
      >({
        url: `/users/message-history/targetUserId=${targetUserId}&page=${page}&limit=${limit}`,
        method: "GET",
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
          errorMessage: "getP2PMessageHistory failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getP2PMessageHistory failed",
      };
    }
  },
  async getP2PNewMessagesSinceDT(
    targetUserId: string,
    datetime: string
  ): Promise<IApiResponse<IGetMessageHistoryResponse, string>> {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<IGetMessageHistoryResponse>
      >({
        url: `/users/new-messages/targetUserId=${targetUserId}&dateTime=${datetime}`,
        method: "GET",
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
          errorMessage: "getP2PNewMessagesSinceDT history failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getP2PNewMessagesSinceDT history failed",
      };
    }
  },
  async getActivities(): Promise<
    IApiResponse<{ [key in ActivityVerbEnum]: IActivity[] }, string>
  > {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<{ [key in ActivityVerbEnum]: IActivity[] }>
      >({
        url: `/users/activities`,
        method: "GET",
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
          errorMessage: "getNotifications failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getNotifications failed",
      };
    }
  },
  async sendMessage(
    message: string,
    fileIds: string[],
    userId: string,
    channelId: string
  ): Promise<IApiResponse<IMessage, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IMessage>>({
        url: `/users/send-message`,
        method: "POST",
        data: {
          message,
          channelId,
          userId,
          fileIds,
        },
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
          errorMessage: "sendMessage failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "sendMessage failed",
      };
    }
  },
  async sendP2PMessage(
    message: string,
    userId: string,
    fileIds: string[],
    receiverId: string
  ): Promise<IApiResponse<IMessage, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IMessage>>({
        url: `/users/send-p2p-message`,
        method: "POST",
        data: {
          message,
          userId,
          fileIds,
          receiverId,
        },
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
          errorMessage: "sendP2PMessage failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "sendP2PMessage failed",
      };
    }
  },
  async getPendingRegisterByURL(
    url: string
  ): Promise<IApiResponse<IPendingRegister, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IPendingRegister>>({
        url: `/users/pending-registers/${url}`,
        method: "GET",
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
          errorMessage: "getPendingRegisterByURL failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getPendingRegisterByURL failed",
      };
    }
  },
  async verify(
    otpCode: number,
    url: string
  ): Promise<IApiResponse<IUserInfoLite, VerifyErrorTypeEnum>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IVerifyOTPRes>>({
        url: `/users/verify/${url}`,
        method: "POST",
        data: {
          otpCode,
        },
        withCredentials: true,
      });
      if (response.data.status === "Success") {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: response.data.errorType,
        };
      }
    } catch (e: any) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: e.response.data.errorType,
      };
    }
  },
  async resend(url: string): Promise<IApiResponse<IPendingRegister, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IPendingRegister>>({
        method: "POST",
        url: `users/resend/${url}`,
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
          errorMessage: "resend failed",
        };
      }
    } catch (err) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "resend failed",
      };
    }
  },
};
