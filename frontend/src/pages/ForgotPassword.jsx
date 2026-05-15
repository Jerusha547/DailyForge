// import { useState } from "react";
// import api from "../api/axios";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.post("/auth/forgot-password", {
//         email,
//       });

//       setMessage(res.data.message);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//       <h1>Forgot Password</h1>

//       <input
//         type="email"
//         placeholder="Enter email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <button type="submit">Send Reset Link</button>

//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default ForgotPassword;

import { useState } from "react";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/forgot-password", { email });

      setMessage(res.data.message);
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
          <h1 className="text-3xl font-bold text-main">Forgot Password</h1>

          <p className="text-sm text-muted">
            Enter your email address to receive a password reset link.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="
              text-sm font-medium text-main
            "
          >
            Email Address
          </label>

          <input
            type="email"
            id="email"
            placeholder="user@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Send Reset Link
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

export default ForgotPassword;
