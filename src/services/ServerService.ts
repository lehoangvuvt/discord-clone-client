import {
  IApiResponse,
  ICreateServerData,
  IServer,
  IChannel,
  IUserServer,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const ServerService = {
  async createServer(
    data: ICreateServerData
  ): Promise<IApiResponse<IServer, string>> {
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

  async getServerChannels(
    serverId: string
  ): Promise<IApiResponse<IChannel[], string>> {
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
  async leaveServer(
    serverId: string
  ): Promise<IApiResponse<IUserServer, string>> {
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
