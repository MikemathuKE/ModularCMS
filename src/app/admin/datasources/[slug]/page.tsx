"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import EndpointModal, { EndpointForm } from "@/components/admin/EndpointModal";

/* ----------------------------- Types ----------------------------- */

type AuthType = "none" | "apiKey" | "bearer" | "basic" | "oauth2";

interface DataSourceForm {
  name: string;
  slug: string;
  baseUrl: string;
  defaultHeaders: Record<string, string>;
  auth: {
    type: AuthType;
    apiKeyName?: string;
    apiKeyIn?: "header" | "query";
    secretRef?: string;
    usernameRef?: string;
    passwordRef?: string;
  };
}

/* ----------------------------- Helpers ----------------------------- */

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* ----------------------------- Component ----------------------------- */

export default function DataSourceEditorPage() {
  const params = useParams();
  const router = useRouter();

  const isCreate = params.slug === "new";

  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "auth" | "endpoints">(
    "general"
  );

  const [dataSourceId, setDataSourceId] = useState<string | null>(null);
  const [endpointPage, setEndpointPage] = useState<number>(1);
  const [endpointLimit, setEndpointLimit] = useState<number>(10);
  const [endpointSearch, setEndpointSearch] = useState<string>("");

  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<EndpointForm | null>(
    null
  );

  const [form, setForm] = useState<DataSourceForm>({
    name: "",
    slug: "",
    baseUrl: "",
    defaultHeaders: {},
    auth: { type: "none" },
  });

  const [endpoints, setEndpoints] = useState<EndpointForm[]>([]);

  /* ----------------------------- Fetch (Edit) ----------------------------- */

  useEffect(() => {
    if (isCreate) return;

    async function fetchDataSource() {
      try {
        const res = await fetch(`/api/cms/datasources/${params.slug}`);
        const json = await res.json();

        setForm({
          name: json.name,
          slug: json.slug,
          baseUrl: json.baseUrl,
          defaultHeaders: json.defaultHeaders || {},
          auth: json.auth || { type: "none" },
        });
        setDataSourceId(json._id);
        refreshEndpoints(json._id);
      } catch (err) {
        console.error("Failed to load datasource", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDataSource();
  }, [isCreate, params.slug]);

  async function refreshEndpoints(id?: string) {
    const res = await fetch(
      `/api/cms/datasourceendpoints?dataSourceId=${
        id || dataSourceId
      }&page=${endpointPage}&limit=${endpointLimit}&search=${endpointSearch}`
    );
    const json = await res.json();

    setEndpoints(json.items || []);
  }

  /* ----------------------------- Save ----------------------------- */

  async function handleSave() {
    setSaving(true);

    try {
      const res = await fetch(
        isCreate
          ? "/api/cms/datasources"
          : `/api/cms/datasources/${params.slug}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const json = await res.json();

      if (isCreate) {
        setDataSourceId(json.data._id);
        router.replace(`/admin/datasources/${json.data._id}`);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full h-full justify-center items-center">
      <div className="p-6 max-w-5xl">
        {/*Endpoint Add / Edit Modal */}
        <EndpointModal
          open={endpointModalOpen}
          initialData={editingEndpoint ?? undefined}
          onClose={() => setEndpointModalOpen(false)}
          onSave={async (data) => {
            await fetch(
              editingEndpoint
                ? `/api/cms/datasourceendpoints/${editingEndpoint._id}`
                : `/api/cms/datasourceendpoints`,
              {
                method: editingEndpoint ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...data,
                  dataSource: dataSourceId,
                }),
              }
            );

            // refetch endpoints here
            refreshEndpoints();
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isCreate ? "Create Data Source" : "Edit Data Source"}
          </h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6 flex gap-6">
          {["general", "auth", "endpoints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              disabled={tab === "endpoints" && !dataSourceId}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
              } ${
                tab === "endpoints" && !dataSourceId
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* -------------------- General -------------------- */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: slugify(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Slug</label>
              <input
                className="w-full border px-3 py-2 rounded text-sm"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={!isCreate}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Base URL</label>
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="https://api.example.com"
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* -------------------- Auth -------------------- */}
        {activeTab === "auth" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block font-medium mb-1">Auth Type</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.auth.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    auth: { type: e.target.value as AuthType },
                  })
                }
              >
                <option value="none">None</option>
                <option value="apiKey">API Key</option>
                <option value="bearer">Bearer</option>
                <option value="basic">Basic</option>
                <option value="oauth2">OAuth2</option>
              </select>
            </div>

            {form.auth.type === "apiKey" && (
              <>
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="API Key Name"
                  value={form.auth.apiKeyName || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: { ...form.auth, apiKeyName: e.target.value },
                    })
                  }
                />

                <select
                  className="w-full border px-3 py-2 rounded"
                  value={form.auth.apiKeyIn || "header"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: {
                        ...form.auth,
                        apiKeyIn: e.target.value as any,
                      },
                    })
                  }
                >
                  <option value="header">Header</option>
                  <option value="query">Query</option>
                </select>

                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Secret Reference"
                  value={form.auth.secretRef || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: { ...form.auth, secretRef: e.target.value },
                    })
                  }
                />
              </>
            )}

            {form.auth.type === "basic" && (
              <>
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Username Secret"
                  value={form.auth.usernameRef || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: { ...form.auth, usernameRef: e.target.value },
                    })
                  }
                />
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Password Secret"
                  value={form.auth.passwordRef || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: { ...form.auth, passwordRef: e.target.value },
                    })
                  }
                />
              </>
            )}

            {form.auth.type === "bearer" && (
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Token Secret"
                value={form.auth.secretRef || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    auth: { ...form.auth, secretRef: e.target.value },
                  })
                }
              />
            )}
          </div>
        )}

        {/* -------------------- Endpoints -------------------- */}
        {activeTab === "endpoints" && dataSourceId && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Endpoints</h2>

              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setEditingEndpoint(null);
                  setEndpointModalOpen(true);
                }}
              >
                Add Endpoint
              </button>
            </div>

            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Method</th>
                  <th className="border px-3 py-2">Path</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep) => (
                  <tr key={ep._id}>
                    <td className="border px-3 py-2">{ep.name}</td>
                    <td className="border px-3 py-2">{ep.method}</td>
                    <td className="border px-3 py-2 font-mono text-sm">
                      {ep.path}
                    </td>
                    <td className="border px-3 py-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() => {
                          setEditingEndpoint(ep);
                          setEndpointModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {endpoints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No endpoints attached
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
