import { IChannel, IServerInfo, IUserInfo } from "@/types/api.type";
import { createSlice } from "@reduxjs/toolkit";
import { IServer } from "@/types/api.type";

export type Palette = {
  backgroundColor: string;
  color: string;
};

type State = {
  theme: {
    name: "LIGHT" | "DARK";
    palette: Palette;
  };
  lang: "vi_VN" | "en_US";
  channelId: string | null;
  userInfo: IUserInfo | null;
  userVoiceState: {
    mute: boolean;
    volumeState: number;
  };
  currentConnection: {
    server: IServer | null | "@me";
    channelId: string | null | "@me";
  };
  notification: {
    friendRequest: number;
  };
};

const initialState: State = {
  theme: {
    name: "LIGHT",
    palette: {
      backgroundColor: "white",
      color: "black",
    },
  },
  lang: "vi_VN",
  channelId: null,
  userInfo: null,
  userVoiceState: {
    mute: false,
    volumeState: 1,
  },
  currentConnection: {
    server: null,
    channelId: null,
  },
  notification: {
    friendRequest: 0,
  },
};

const appSlice = createSlice({
  name: "APP",
  initialState,
  reducers: {
    setTheme: (state, action: { payload: "LIGHT" | "DARK" }) => {
      switch (action.payload) {
        case "LIGHT":
          state.theme = {
            name: "LIGHT",
            palette: {
              backgroundColor: "#F9F5F6",
              color: "#03001C",
            },
          };
          break;
        case "DARK":
          state.theme = {
            name: "DARK",
            palette: {
              backgroundColor: "#03001C",
              color: "#DDE6ED",
            },
          };
          break;
      }
    },
    setLang: (state, action) => {
      localStorage.setItem("LANG", action.payload);
      state.lang = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    toggleMute: (state) => {
      state.userVoiceState.mute = !state.userVoiceState.mute;
    },
    toggleVolumeState: (state) => {
      state.userVoiceState.volumeState =
        state.userVoiceState.volumeState == 1 ? 0 : 1;
    },
    setServer: (state, action) => {
      state.currentConnection.server = action.payload;
    },
    setChannelId: (state, action) => {
      state.currentConnection.channelId = action.payload;
    },
    setNotification: (
      state,
      action: { payload: { type: "FR"; value: number } }
    ) => {
      switch (action.payload.type) {
        case "FR":
          state.notification.friendRequest = action.payload.value;
          break;
      }
    },
  },
});

export const {
  setTheme,
  setLang,
  setUserInfo,
  toggleMute,
  toggleVolumeState,
  setServer,
  setChannelId,
  setNotification,
} = appSlice.actions;
export default appSlice.reducer;
