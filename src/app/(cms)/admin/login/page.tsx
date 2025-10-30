"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (mode === "login") {
        router.push("/admin");
      } else {
        // After registering, auto-login or switch to login mode
        alert("Registration successful! You can now log in.");
        setMode("login");
      }
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="top-0 left-0 absolute w-full h-full flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-md w-80 flex-row"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Admin Login" : "Register"}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>

        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-blue-600 underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
