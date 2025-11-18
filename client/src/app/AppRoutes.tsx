import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
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
      <Route index element={<h1>Homepage</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
    </Route>
  )
);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
