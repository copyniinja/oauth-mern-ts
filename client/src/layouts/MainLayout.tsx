import { useApplyTheme } from "@/features/theme/useApplyTheme";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  useApplyTheme();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 ">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
