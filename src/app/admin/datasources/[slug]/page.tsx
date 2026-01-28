"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EndpointModal, { EndpointForm } from "@/components/admin/EndpointModal";
import TestEndpointModal from "@/components/admin/TestEndpointModal";

import { slugify } from "@/lib/helperFunctions";
import { DataSourceForm } from "@/lib/types/types";
import SecretCreator from "@/components/admin/SecretCreator";
import SecretSelect from "@/components/admin/SecretSelect";

export default function DataSourceEditorPage() {
  const params = useParams();
  const router = useRouter();

  const isCreate = params.slug === "new";

  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "auth" | "endpoints">(
    "general",
  );

  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loadingSecrets, setLoadingSecrets] = useState(false);

  const [dataSourceId, setDataSourceId] = useState<string | null>(null);
  const [dataSourceSlug, setDataSourceSlug] = useState<string | null>(null);
  const [endpointPage, setEndpointPage] = useState<number>(1);
  const [endpointLimit, setEndpointLimit] = useState<number>(10);
  const [endpointSearch, setEndpointSearch] = useState<string>("");

  const [endpointModalOpen, setEndpointModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<EndpointForm | null>(
    null,
  );
  const [endpointTestModalOpen, setEndpointTestModalOpen] = useState(false);
  const [testEndpointId, setTestEndpointId] = useState<string>("");

  const [form, setForm] = useState<DataSourceForm>({
    name: "",
    slug: "",
    baseUrl: "",
    defaultHeaders: {},
    auth: { type: "none" },
  });

  const [endpoints, setEndpoints] = useState<EndpointForm[]>([]);

  useEffect(() => {
    async function loadSecrets() {
      setLoadingSecrets(true);
      try {
        const res = await fetch("/api/cms/secrets");
        const data = await res.json();
        setSecrets(data.data || []);
      } catch (err) {
        console.error("Failed to load secrets", err);
      } finally {
        setLoadingSecrets(false);
      }
    }

    loadSecrets();
  }, []);

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
        setDataSourceSlug(json.slug);
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
      }&page=${endpointPage}&limit=${endpointLimit}&search=${endpointSearch}`,
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
        },
      );

      const json = await res.json();

      if (isCreate) {
        setDataSourceId(json.data._id);
        router.push(`/admin/datasources/${json.data.slug}`);
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
          parentDataSource={dataSourceSlug || ""}
          onClose={() => setEndpointModalOpen(false)}
          onSave={async (data) => {
            await fetch(
              editingEndpoint
                ? `/api/cms/datasourceendpoints/${editingEndpoint.slug}`
                : `/api/cms/datasourceendpoints`,
              {
                method: editingEndpoint ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...data,
                  dataSource: dataSourceId,
                }),
              },
            );

            // refetch endpoints here
            refreshEndpoints();
          }}
        />

        {/* Test Endpoint Modal */}
        {endpointTestModalOpen && (
          <TestEndpointModal
            open={true}
            slugId={testEndpointId}
            onClose={() => {
              setEndpointTestModalOpen(false);
              setTestEndpointId("");
            }}
          />
        )}

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
        {/* -------------------- Auth -------------------- */}
        {activeTab === "auth" && (
          <div className="space-y-4 max-w-xl">
            {/* Auth Type */}
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

            {/* ---------- API KEY ---------- */}
            {form.auth.type === "apiKey" && (
              <div className="space-y-3">
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="API Key Name (e.g. x-api-key)"
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

                <div>
                  <label className="text-sm mb-1 block">API Key Secret</label>
                  <SecretSelect
                    value={form.auth.secretRef}
                    secrets={secrets}
                    onChange={(slug) =>
                      setForm({
                        ...form,
                        auth: { ...form.auth, secretRef: slug },
                      })
                    }
                  />
                </div>

                <SecretCreator
                  onCreated={(s) => {
                    setSecrets([...secrets, s]);
                    setForm({
                      ...form,
                      auth: { ...form.auth, secretRef: s.slug },
                    });
                  }}
                />
              </div>
            )}

            {/* ---------- BEARER ---------- */}
            {form.auth.type === "bearer" && (
              <div className="space-y-3">
                <label className="text-sm">Bearer Token Secret</label>

                <SecretSelect
                  value={form.auth.secretRef}
                  secrets={secrets}
                  onChange={(slug) =>
                    setForm({
                      ...form,
                      auth: { ...form.auth, secretRef: slug },
                    })
                  }
                />

                <SecretCreator
                  onCreated={(s) => {
                    setSecrets([...secrets, s]);
                    setForm({
                      ...form,
                      auth: { ...form.auth, secretRef: s.slug },
                    });
                  }}
                />
              </div>
            )}

            {/* ---------- BASIC ---------- */}
            {form.auth.type === "basic" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm mb-1 block">Username Secret</label>
                  <SecretSelect
                    value={form.auth.usernameRef}
                    secrets={secrets}
                    onChange={(slug) =>
                      setForm({
                        ...form,
                        auth: { ...form.auth, usernameRef: slug },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Password Secret</label>
                  <SecretSelect
                    value={form.auth.passwordRef}
                    secrets={secrets}
                    onChange={(slug) =>
                      setForm({
                        ...form,
                        auth: { ...form.auth, passwordRef: slug },
                      })
                    }
                  />
                </div>

                <SecretCreator
                  onCreated={(s) => {
                    setSecrets([...secrets, s]);
                  }}
                />
              </div>
            )}

            {/* OAuth2 placeholder (future) */}
            {form.auth.type === "oauth2" && (
              <p className="text-sm text-gray-500">
                OAuth2 configuration coming soon.
              </p>
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
                        className="px-2 py-1 bg-amber-100 border rounded"
                        onClick={() => {
                          setEditingEndpoint(ep);
                          setEndpointModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 ml-2 py-1 bg-green-100 border rounded"
                        onClick={() => {
                          setTestEndpointId(ep.slug);
                          setEndpointTestModalOpen(true);
                        }}
                      >
                        Test
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
