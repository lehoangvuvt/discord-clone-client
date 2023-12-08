import {
  IApiResponse,
  IAttachment,
  IAttachmentResponse,
  IUploadFile,
  IUploadFileResponse,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const FileService = {
  async uploadFile(
    data: IUploadFile
  ): Promise<IApiResponse<IUploadFileResponse, string>> {
    const response = await baseAxios<
      IUploadFile,
      AxiosResponse<IUploadFileResponse>
    >({ url: "/files/upload", data, method: "POST", withCredentials: true });
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
  ): Promise<IApiResponse<IAttachmentResponse, string>> {
    const response = await baseAxios<
      IAttachment,
      AxiosResponse<IAttachmentResponse>
    >({
      url: `/attachments/${attachmentId}`,
      method: "GET",
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
        errorMessage: `Cannot get attachment ${attachmentId}`,
      };
    }
  },
};
