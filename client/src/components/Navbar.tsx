import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/config/navItems";
import { logout } from "@/features/auth/authSlice";
import ThemeSwitcher from "@/features/theme/components/ThemeSwitcher";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // get current route

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* LOGO */}
        <div
          className="text-2xl font-bold cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          onClick={() => navigate("/")}
        >
          E-SHOP
        </div>

        {/* Nav Items */}
        <ul className="flex items-center space-x-6 text-sm">
          {NAV_ITEMS.map((n) => (
            <li key={n.path}>
              <Link
                key={n.label}
                to={n.path}
                className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme switcher + Login/User */}
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          {!user && (
            <div className="flex space-x-1">
              {location.pathname !== "/login" && (
                <Button onClick={() => navigate("/login")}>Login</Button>
              )}
              {location.pathname !== "/register" && (
                <Button onClick={() => navigate("/register")}>Register</Button>
              )}
            </div>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar className="w-9 h-9 rounded-full shadow border-2">
                    {user.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                sideOffset={5}
                className="w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow-md p-1"
              >
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
