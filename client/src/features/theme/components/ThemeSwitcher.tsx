import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { setTheme, type Theme } from "../themeSlice";

export default function ThemeSwitcher() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  // Handle theme change
  function handleChange(theme: Theme) {
    dispatch(setTheme(theme));
  }

  // Return
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {mode === "dark" && (
          <DropdownMenuItem onClick={() => handleChange("light")}>
            Light
          </DropdownMenuItem>
        )}
        {mode === "light" && (
          <DropdownMenuItem onClick={() => handleChange("dark")}>
            Dark
          </DropdownMenuItem>
        )}
        {mode === "system" ? (
          <>
            <DropdownMenuItem onClick={() => handleChange("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleChange("light")}>
              Light
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => handleChange("system")}>
            System
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
