import {
  ILoginData,
  IUserInfo,
  IApiResponse,
  IRegisterData,
  IAttachment,
  IAttachmentResponse,
  IUploadFile,
  IUploadFileResponse,
  UpdateUserInfo,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const APIService = {
  async login(data: ILoginData): Promise<IApiResponse<IUserInfo>> {
    const response = await baseAxios.post<ILoginData, AxiosResponse<IUserInfo>>(
      "/users/login",
      data,
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return {
        data: response.data,
      };
    } else {
      return {
        error: {
          errorCode: response.status,
          errorMessage: "Wrong username or password",
        },
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
        data: response.data,
      };
    } else {
      return {
        error: {
          errorCode: response.status,
          errorMessage: "Cannot register",
        },
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
        data: response.data,
      };
    } else {
      return {
        error: {
          errorCode: response.status,
          errorMessage: `Cannot upload file ${data.name}`,
        },
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
        data: response.data,
      };
    } else {
      return {
        error: {
          errorCode: response.status,
          errorMessage: `Cannot get attachment ${attachmentId}`,
        },
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
          data: response.data,
        };
      } else {
        return {
          error: {
            errorCode: response.status,
            errorMessage: "Athentication failed",
          },
        };
      }
    } catch (e) {
      return {
        error: {
          errorCode: 401,
          errorMessage: "Athentication failed",
        },
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
          data: response.data,
        };
      } else {
        return {
          error: {
            errorCode: response.status,
            errorMessage: "Get access token failed",
          },
        };
      }
    } catch (e) {
      return {
        error: {
          errorCode: 401,
          errorMessage: "Get access token failed",
        },
      };
    }
  },
  async updateUserInfo(
    userInfo: UpdateUserInfo
  ): Promise<IApiResponse<IUserInfo>> {
    try {
      const response = await baseAxios.post<null, AxiosResponse<IUserInfo>>(
        `/users/update`,
        userInfo,
        { withCredentials: true }
      );
      if (response.status === 200) {
        return {
          data: response.data,
        };
      } else {
        return {
          error: {
            errorCode: response.status,
            errorMessage: "Update user info failed",
          },
        };
      }
    } catch (e) {
      return {
        error: {
          errorCode: 400,
          errorMessage: "Update user info failed",
        },
      };
    }
  },
};
