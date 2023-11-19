import {
  ILoginData,
  IUserInfo,
  IApiResponse,
  IRegisterData,
  IAttachment,
  IAttachmentResponse,
  IUploadFile,
  IUploadFileResponse,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const APIService = {
  async login(data: ILoginData): Promise<IApiResponse<IUserInfo>> {
    const response = await baseAxios.post<ILoginData, AxiosResponse<IUserInfo>>(
      "/users/login",
      data
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
};
