import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          surface-bg
          px-10 py-12
          rounded-2xl
          w-full max-w-md
          flex flex-col gap-6
          shadow-lg
          border border-white/10
          animate-in
        "
      >
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-main">Reset Password</h1>

          <p className="text-sm text-muted">Enter your new password below.</p>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="
              text-sm font-medium text-main
            "
          >
            New Password
          </label>

          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="
              w-full px-4 py-3
              rounded-lg
              border-soft
              surface-bg
              text-sm
              shadow-xs
              input-focus
            "
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="
            btn btn-primary
            w-full
            hover-lift
            cursor-pointer
          "
        >
          Reset Password
        </button>

        {/* Message */}
        {message && (
          <div
            className="
              text-sm text-center
              px-4 py-3
              rounded-lg
              bg-blue-100
              text-blue-700
              border border-blue-300
            "
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
