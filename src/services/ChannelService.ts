import { IApiResponse, IGetMessageHistoryResponse } from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const ChannelService = {
  async getMessageHistory(
    channelId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<IApiResponse<IGetMessageHistoryResponse, string>> {
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
  ): Promise<IApiResponse<IGetMessageHistoryResponse, string>> {
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
};
