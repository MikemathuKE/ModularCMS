"use client";

import { useEffect, useState } from "react";

interface TestEndpointModalProps {
  open: boolean;
  onClose: () => void;
  slugId: string;
}

interface TestResult {
  status: number;
  durationMs: number;
  headers: Record<string, string>;
  body: any;
  ok: boolean;
  url: string;
  method: string;
  error?: string;
}

export default function TestEndpointModal({
  open,
  onClose,
  slugId,
}: TestEndpointModalProps) {
  const [loading, SetLoading] = useState(false);
  const [result, SetResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (!open) return;
    runTest();
  }, [open]);

  async function runTest() {
    SetLoading(true);
    SetResult(null);

    try {
      const res = await fetch(`/api/cms/datasourceendpoints/${slugId}/test`, {
        method: "POST",
      });

      const data = await res.json();

      SetResult(data);
    } catch (err: any) {
      SetResult({
        status: 0,
        durationMs: 0,
        headers: {},
        body: null,
        url: "",
        method: "",
        ok: false,
        error: err.message || "Request failed",
      });
    } finally {
      SetLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-3xl p-6 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Test Endpoint</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center text-gray-600">Running test...</div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {result.error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-4">
            <div className="flex align-right text-sm bg-gray-300 shadow-sm shadow-gray-400 p-1">
              <span>{result.url}</span>
            </div>
            {/* Status Row */}
            <div className="flex gap-4 text-sm">
              <span
                className={`px-2 py-1 rounded text-white ${
                  result.status >= 200 && result.status < 300
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                Status: {result.status}
              </span>

              <span className="px-2 py-1 rounded bg-gray-200">
                {result.durationMs} ms
              </span>
            </div>

            {/* Headers */}
            <div>
              <h3 className="font-semibold mb-1">Response Headers</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(result.headers, null, 2)}
              </pre>
            </div>

            {/* Body */}
            <div>
              <h3 className="font-semibold mb-1">Response Body</h3>
              <pre className="bg-gray-900 text-green-200 p-3 rounded text-sm overflow-auto max-h-96">
                {typeof result.body === "string"
                  ? result.body
                  : JSON.stringify(result.body, null, 2)}
              </pre>
            </div>

            {/* Re-run */}
            <button
              onClick={runTest}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
