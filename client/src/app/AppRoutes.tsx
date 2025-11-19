import AuthSuccess from "@/features/auth/pages/AuthSuccess";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ProtectedRoutes from "@/layouts/ProtectedRoutes";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import MainLayout from "../layouts/MainLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/success" element={<AuthSuccess />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
  )
);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
