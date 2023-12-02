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
  ): Promise<IApiResponse<IAttachmentResponse, string>> {
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
};
