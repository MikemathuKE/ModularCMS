"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterDomainPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: "",
    domain: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.adminPassword !== form.confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      setMessageIsError(true);
      return;
    }

    setMessage("Registering...");
    setMessageIsError(false);

    const res = await fetch("/api/register-domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`Domain registered successfully: ${data.domain}`);
      setMessageIsError(false);
      router.push(`/admin/tenants`);
    } else {
      setMessage(`Error: ${data.error}`);
      setMessageIsError(true);
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Register New Tenant
        </h1>

        <label className="block mb-2 font-medium">Identifier / Slug</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="example"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <label className="block mb-2 font-medium">Domain / Subdomain</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="example.com or app.example.com"
          value={form.domain}
          onChange={(e) => setForm({ ...form, domain: e.target.value })}
        />

        <label className="block mb-2 font-medium">Admin Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="you@example.com"
          value={form.adminEmail}
          onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
        />

        <label className="block mb-2 font-medium">Admin Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={form.adminPassword}
          onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
        />

        <label className="block mb-2 font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        {message && (
          <p
            className={
              "w-full p-4 mt-4 text-center " + messageIsError
                ? " text-xl text-red-600"
                : "text-sm  text-gray-600"
            }
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
