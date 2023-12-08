import { createSlice } from "@reduxjs/toolkit";

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
  // userInfo: IUserInfo | null;
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
  // userInfo: null,
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
    // setUserInfo: (state, action) => {
    //   state.userInfo = action.payload;
    // },
    setNotification: (
      state,
      action: { payload: { type: "FR"; value: number } }
    ) => {
      switch (action.payload.type) {
        case "FR":
          state.notification.friendRequest += action.payload.value;
          break;
      }
    },
  },
});

export const { setTheme, setLang, setNotification } = appSlice.actions;
export default appSlice.reducer;
