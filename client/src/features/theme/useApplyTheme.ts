import { useAppSelector } from "@/app/hook";
import { useEffect } from "react";

export function useApplyTheme() {
  const theme = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // If mode is "system"
    if (theme.mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    // If mode is light or dark
    root.classList.add(theme.mode);
  }, [theme]);
}
