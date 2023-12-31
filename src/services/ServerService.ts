import {
  IApiResponse,
  ICreateServerData,
  IServer,
  IChannel,
  IUserServer,
  IServerInfo,
  IServerInvitationDetails,
  IUseServerInvitationResponse,
  IServerInvitation,
} from "@/types/api.type";
import baseAxios from "./baseAxios";
import { AxiosResponse } from "axios";

export const ServerService = {
  async createServer(
    data: ICreateServerData
  ): Promise<IApiResponse<IServer, string>> {
    try {
      const response = await baseAxios<
        ICreateServerData,
        AxiosResponse<IServer>
      >({
        url: `/servers/create`,
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
  async getServerInfo(
    serverId: string
  ): Promise<IApiResponse<IServerInfo, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IServerInfo>>({
        url: `/servers/${serverId}`,
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
          errorMessage: "getServerInfo failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getServerInfo failed",
      };
    }
  },
  async getServerChannels(
    serverId: string
  ): Promise<IApiResponse<IChannel[], string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IChannel[]>>({
        url: `/servers/get-channels/${serverId}`,
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
      const response = await baseAxios<null, AxiosResponse<IUserServer>>({
        url: `/servers/leave/serverId=${serverId}`,
        method: "DELETE",
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
  async getServerInvitationDetails(
    invitation_short_id: string
  ): Promise<IApiResponse<IServerInvitationDetails, string>> {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<IServerInvitationDetails>
      >({
        url: `/servers/server-invitation/${invitation_short_id}`,
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
          errorMessage: "getServerInvitationDetails failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "getServerInvitationDetails failed",
      };
    }
  },
  async acceptServerInvitation(
    invitation_short_id: string
  ): Promise<IApiResponse<IUseServerInvitationResponse, string>> {
    try {
      const response = await baseAxios<
        null,
        AxiosResponse<IUseServerInvitationResponse>
      >({
        url: `/servers/use/server-invitation/${invitation_short_id}`,
        method: "GET",
        withCredentials: true,
      });
      if (response.status === 200 && response.data.status === "Success") {
        return {
          status: "Success",
          statusCode: 200,
          data: response.data,
        };
      } else {
        return {
          status: "Error",
          errorCode: response.status,
          errorMessage: "useServerInvitation failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "useServerInvitation failed",
      };
    }
  },
  async createServerInvitation(
    serverId: string
  ): Promise<IApiResponse<IServerInvitation, string>> {
    try {
      const response = await baseAxios<null, AxiosResponse<IServerInvitation>>({
        method: "POST",
        withCredentials: true,
        url: `/servers/create/server-invitation/${serverId}`,
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
          errorMessage: "createServerInvitation failed",
        };
      }
    } catch (e) {
      return {
        status: "Error",
        errorCode: 400,
        errorMessage: "createServerInvitation failed",
      };
    }
  },
};
