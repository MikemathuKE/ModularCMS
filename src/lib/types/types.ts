export interface ContentType {
  _id: string;
  name: string;
  slug: string;
  fields: { name: string; type: string; required: boolean }[];
}

export type AuthType = "none" | "apiKey" | "bearer" | "basic" | "oauth2";

export interface DataSourceForm {
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

export interface Secret {
  _id: string;
  name: string;
  slug: string;
}
