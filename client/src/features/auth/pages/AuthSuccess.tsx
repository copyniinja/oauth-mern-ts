import { useAppDispatch } from "@/app/hook";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { setCredential } from "../authSlice";

export default function AuthSuccess() {
  const [params] = useSearchParams();
  const accessToken = params.get("accessToken");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;

    const loadUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        dispatch(
          setCredential({
            ...res.data.user,
            accessToken,
          })
        );

        navigate("/profile");
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    loadUser();
  }, [accessToken, dispatch, navigate]);

  return <div>Logging you in...</div>;
}
