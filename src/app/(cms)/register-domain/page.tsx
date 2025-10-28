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
  });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Registering...");

    const res = await fetch("/api/register-domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`Domain registered successfully: ${data.domain}`);
      router.replace(`${data.domain}`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Register New Domain
        </h1>

        <label className="block mb-2 font-medium">Identifier / Slug</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          placeholder="example.com or app.example.com"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
