import { useAppSelector } from "@/app/hook";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const [showToken, setShowToken] = useState(false);

  if (!user) return <p className="text-center mt-20">No user data found.</p>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 rounded-full shadow-md">
          <AvatarImage src={user.profileImage} alt={user.name} />
        </Avatar>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {user.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
          {user.role}
        </span>

        <div className="w-full mt-4">
          <label className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md p-2">
            <span className="text-gray-700 dark:text-gray-200 text-sm truncate">
              Access Token
            </span>
            <button
              type="button"
              onClick={() => setShowToken((prev) => !prev)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showToken ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </label>
          {showToken && (
            <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-600 rounded-md text-xs text-gray-800 dark:text-gray-100 break-words">
              {user.accessToken}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
