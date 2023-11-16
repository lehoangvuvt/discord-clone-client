import { UserInfo } from "@/types/api.type";
import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

export type Palette = {
  backgroundColor: string;
  color: string;
};

const initialState: {
  theme: {
    name: "LIGHT" | "DARK";
    palette: Palette;
  };
  lang: "vi_VN" | "en_US";
  channelId: string | null;
  userInfo: UserInfo | null;
} = {
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
    setChannelId: (state, action) => {
      state.channelId = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setTheme, setLang, setChannelId, setUserInfo } =
  appSlice.actions;
export default appSlice.reducer;
