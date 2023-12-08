import {
  ActivityVerbEnum,
  IActivity,
  IServer,
  IUserInfo,
} from "@/types/api.type";
import { create } from "zustand";

type State = {
  userInfo: IUserInfo | null;
  setUserInfo: (userInfo: IUserInfo | null) => void;

  currentConnection: {
    server: IServer | null | "@me";
    channelId: string | null | "@me";
  };
  setServer: (server: IServer | null | "@me") => void;
  setChannelId: (channelId: string | null | "@me") => void;

  userVoiceState: {
    mute: boolean;
    volumeState: number;
  };
  toggleMute: () => void;
  toggleVolumeState: () => void;

  notifications: { [key in ActivityVerbEnum]: IActivity[] } | null;
  setNotifications: (notifications: {
    [key in ActivityVerbEnum]: IActivity[];
  }) => void;
};

const useStore = create<State>((set) => ({
  userInfo: null,
  currentConnection: {
    server: null,
    channelId: null,
  },
  userVoiceState: {
    mute: false,
    volumeState: 1,
  },
  notifications: null,
  setUserInfo: (userInfo: IUserInfo | null) =>
    set((state: State) => ({ userInfo: userInfo })),
  setServer: (server: IServer | null | "@me") =>
    set((state: State) => ({
      currentConnection: {
        ...state.currentConnection,
        server,
      },
    })),
  setChannelId: (channelId: string | null | "@me") =>
    set((state: State) => ({
      currentConnection: {
        ...state.currentConnection,
        channelId,
      },
    })),
  toggleMute: () =>
    set((state: State) => ({
      userVoiceState: {
        ...state.userVoiceState,
        mute: !state.userVoiceState.mute,
      },
    })),
  toggleVolumeState: () =>
    set((state: State) => ({
      userVoiceState: {
        ...state.userVoiceState,
        volumeState: state.userVoiceState.volumeState === 1 ? 0 : 1,
      },
    })),
  setNotifications: (notifications: {
    [key in ActivityVerbEnum]: IActivity[];
  }) =>
    set((state: State) => ({
      notifications: notifications,
    })),
}));

export default useStore;
