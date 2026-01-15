// import { getOrCreateSecretModel } from "@/models/Secret";
// import { getOrCreateExecutionLogModel } from "@/models/DataSourceExecutionLog";
// import {
//   getOrCreateContentTypeModel,
//   ContentTypeDoc,
//   ContentTypeField,
// } from "@/models/ContentType";

// function validateField(
//   field: ContentTypeField,
//   value: any,
//   path: string,
//   slug: string
// ) {
//   if (field.required && value === undefined) {
//     console.warn(`Missing required field: ${path}`);
//     throw new Error(
//       `Missing required field '${path}' in DataSource response (${slug})`
//     );
//     return;
//   }

//   if (field.kind === "primitive") return;

//   if (field.kind === "object" && value) {
//     for (const sub of field.fields) {
//       validateField(sub, value[sub.name], `${path}.${sub.name}`, slug);
//     }
//   }

//   if (field.kind === "list" && Array.isArray(value)) {
//     value.forEach((item, i) =>
//       validateField(field.of, item, `${path}[${i}]`, slug)
//     );
//   }
// }

// export async function executeDataSource({
//   tenantConn,
//   dataSource,
//   endpoint,
//   contentType, // <-- REQUIRED ContentType or slug
//   runtimeParams = {},
// }: {
//   tenantConn: any;
//   dataSource: any;
//   endpoint: any;
//   contentType: ContentTypeDoc | string;
//   runtimeParams?: any;
// }) {
//   const start = Date.now();
//   const Secret = getOrCreateSecretModel(tenantConn);
//   const Log = getOrCreateExecutionLogModel(tenantConn);
//   const ContentType = getOrCreateContentTypeModel(tenantConn);

//   let resolvedContentType: ContentTypeDoc | null = null;

//   try {
//     // -----------------------------
//     // Resolve ContentType
//     // -----------------------------
//     if (typeof contentType === "string") {
//       resolvedContentType = await ContentType.findOne({ slug: contentType });
//       if (!resolvedContentType) {
//         throw new Error(`ContentType not found: ${contentType}`);
//       }
//     } else {
//       resolvedContentType = contentType;
//     }

//     // -----------------------------
//     // Resolve secrets
//     // -----------------------------
//     const resolveSecret = async (slug?: string) => {
//       if (!slug) return undefined;
//       const s = await Secret.findOne({ slug });
//       return s?.value;
//     };

//     // -----------------------------
//     // Build auth headers
//     // -----------------------------
//     const authHeaders: Record<string, string> = {};

//     if (dataSource.auth?.type === "bearer") {
//       const token = await resolveSecret(dataSource.auth.secretRef);
//       if (token) authHeaders.Authorization = `Bearer ${token}`;
//     }

//     if (dataSource.auth?.type === "basic") {
//       const username = await resolveSecret(dataSource.auth.usernameRef);
//       const password = await resolveSecret(dataSource.auth.passwordRef);
//       if (username && password) {
//         const encoded = Buffer.from(`${username}:${password}`).toString(
//           "base64"
//         );
//         authHeaders.Authorization = `Basic ${encoded}`;
//       }
//     }

//     // -----------------------------
//     // Build URL (path params later)
//     // -----------------------------
//     const url = new URL(dataSource.baseUrl + endpoint.path);

//     const res = await fetch(url.toString(), {
//       method: endpoint.method || "GET",
//       headers: {
//         "Content-Type": "application/json",
//         ...dataSource.defaultHeaders,
//         ...endpoint.headers,
//         ...authHeaders,
//       },
//       body:
//         endpoint.method && endpoint.method !== "GET"
//           ? JSON.stringify(endpoint.bodyTemplate)
//           : undefined,
//     });

//     const duration = Date.now() - start;
//     const payload = await res.json();

//     // -----------------------------
//     // Soft validation against ContentType
//     // -----------------------------
//     const validateAgainstContentType = (data: any, ct: ContentTypeDoc) => {
//       if (!data || typeof data !== "object") return;

//       for (const field of ct.fields) {
//         validateField(field, payload[field.name], field.name, ct.slug);
//       }
//     };

//     // Handle array vs object
//     if (Array.isArray(payload)) {
//       payload.forEach((item) =>
//         validateAgainstContentType(item, resolvedContentType!)
//       );
//     } else {
//       validateAgainstContentType(payload, resolvedContentType!);
//     }

//     // -----------------------------
//     // Log success
//     // -----------------------------
//     await Log.create({
//       dataSourceSlug: dataSource.slug,
//       endpointSlug: endpoint.slug,
//       status: res.status,
//       durationMs: duration,
//       success: res.ok,
//     });

//     return payload;
//   } catch (err: any) {
//     await Log.create({
//       dataSourceSlug: dataSource.slug,
//       endpointSlug: endpoint.slug,
//       status: 0,
//       durationMs: Date.now() - start,
//       success: false,
//       error: err.message,
//     });

//     throw err;
//   }
// }
