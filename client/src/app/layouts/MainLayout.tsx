import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
