import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { login } from "../authApi";
import { setCredential } from "../authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      dispatch(
        setCredential({
          name: data.user.name,
          email: data.user.email,
          profileImage: data.user.profileImage,
          role: data.user.role,
          _id: data.user._id,
          accessToken: data.accessToken,
        })
      );
      navigate("/profile"); // redirect after login
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
          Login to Your Account
        </h2>

        {/* Hint Section */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 p-2 rounded">
          <strong className="text-green-700">Hint:</strong> email:{" "}
          <code>admin2@gmail.com</code> | password: <code>123456</code>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold p-3 rounded-md transition"
          >
            Login
          </Button>
        </form>

        <div className="text-center text-gray-500 dark:text-gray-400 my-3">
          or
        </div>

        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold p-3 rounded-md transition"
        >
          Log in with Google
        </Button>
      </div>
    </div>
  );
}
