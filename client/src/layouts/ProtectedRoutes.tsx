import { useAppSelector } from "@/app/hook";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
}
