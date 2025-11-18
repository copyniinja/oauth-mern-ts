import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type Theme = "system" | "dark" | "light";
export interface ThemeState {
  mode: Theme;
}

function getInitialTheme() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    if (theme === "system" || theme === "dark" || theme === "light") {
      return theme;
    }
  }
  return "system";
}
// Initial State
const initialState: ThemeState = {
  mode: getInitialTheme(),
};

// Theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
