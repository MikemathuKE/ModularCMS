import { getOrCreateDataSourceModel, DataSourceDoc } from "@/models/DataSource";
import { getOrCreateDataSourceEndpointsModel } from "@/models/DataSourceEndpoint";
import { resolveDataSourceAuth } from "@/utils/resolveDataSourceAuth";
import { GetTenantSlug } from "@/utils/getTenantSlug";
import { getTenantConnection } from "../mongodb";

export async function executeDataSourceEndpoint(
  endpointId: string,
  params: Record<string, any> = {},
  req: Request
) {
  const tenantSlug = await GetTenantSlug(req.headers.get("host"));
  if (!tenantSlug) throw new Error("Tenant missing");

  const conn = await getTenantConnection(tenantSlug);

  const DataSource = getOrCreateDataSourceModel(conn);
  const DataSourceEndpoint = getOrCreateDataSourceEndpointsModel(conn);
  if (!DataSource) throw new Error("DataSource not found");

  const endpoint = await DataSourceEndpoint.findById(endpointId).populate({
    path: "dataSource",
    model: DataSource,
  });

  if (!endpoint) throw new Error("DataSourceEndpoint not found");

  const ds = endpoint.dataSource as DataSourceDoc;
  if (!ds) throw new Error("Parent DataSource not found");

  // Merge params
  const queryParams = { ...(endpoint.queryParams || {}), ...params };

  // Resolve auth
  const auth = await resolveDataSourceAuth(ds.auth, req);

  const finalQuery = { ...queryParams, ...auth.query };
  const queryString = new URLSearchParams(finalQuery).toString();

  const url = `${ds.baseUrl}${endpoint.path}${
    queryString ? `?${queryString}` : ""
  }`;

  const headers = {
    ...(ds.defaultHeaders || {}),
    ...auth.headers,
  };

  const start = Date.now();
  const res = await fetch(url, { headers });
  const durationMs = Date.now() - start;

  const json = await res.json();

  return {
    status: res.status,
    durationMs,
    data: json,
  };
}
