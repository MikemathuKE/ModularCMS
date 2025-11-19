"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [setupDisabled, setSetupDisabled] = useState(false);

  // Check if setup is already done
  useEffect(() => {
    fetch("/api/check-setup")
      .then((res) => res.json())
      .then((data) => {
        if (data.adminExists) {
          setSetupDisabled(true);
          setLoading(false);
          router.push("/admin/login");
        } else {
          setSetupDisabled(false);
          setLoading(false);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Confirm password validation
    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    setLoading(true);
    const tenantSlug = process.env.NEXT_PUBLIC_DEFAULT_TENANT || "main";
    const domain = window.location.hostname;

    try {
      const res = await fetch("/api/register-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: tenantSlug,
          domain: domain,
          adminEmail: email,
          adminPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Setup completed! Redirecting to login...");
        setTimeout(() => router.push("/admin/login"), 1500);
      } else {
        setMessage(`⚠️ ${data.error || "Error occurred"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (setupDisabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white shadow-md rounded-md text-center">
          <h1 className="text-xl font-bold text-gray-800">
            Setup Already Completed
          </h1>
          <p className="mt-2 text-gray-600">Please login as admin.</p>
          <Link
            href="/admin/login"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <div className="flex flex-col items-center space-y-4">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-t-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            {/* Optional text */}
            <p className="text-gray-700 text-lg font-medium">Loading...</p>
          </div>
        </div>
      )}
      {!loading && (
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Modular CMS Initial Setup
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block text-black w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block text-black w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block text-black w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Setting up..." : "Setup CMS"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
