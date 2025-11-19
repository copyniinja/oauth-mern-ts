import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const savedUserInfo = localStorage.getItem("user");
export type UserInfo = {
  name: string;
  email: string;
  profileImage?: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
  _id: string;
  accessToken: string;
};
const initialState: { user: UserInfo | null } = {
  user: savedUserInfo ? JSON.parse(savedUserInfo) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export default authSlice.reducer;
export const { logout, setCredential } = authSlice.actions;
