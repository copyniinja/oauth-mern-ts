import ThemeSwitcher from "@/features/theme/components/ThemeSwitcher";

export default function Navbar() {
  return (
    <nav className="bg-gray-300 dark:bg-gray-800 dark:text-gray-100 text-gray-700">
      <div className="container mx-auto flex justify-between items-center py-2">
        {/* LOGO */}
        <div className="text-lg">
          <h1>E-SHOP</h1>
        </div>
        {/* Nav Items */}
        <ul className="flex text-sm space-x-3">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        {/* Theme and login button or User Avatar */}
        <div>
          {/* Theme switcher */}
          <ThemeSwitcher />
          {/* Login or Register */}
          {/* User Avatar */}
        </div>
      </div>
    </nav>
  );
}
