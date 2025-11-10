import { ContentType, ContentTypeDoc } from "@/models/ContentType";
import { getContentModel } from "@/utils/getContentModel";

type JSONNode = {
  component: string;
  props?: Record<string, any>;
  children?: Array<JSONNode | string | number>;
  dataSource?: {
    type: string; // content type slug
    query?: Record<string, any>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    template: JSONNode; // subtree to repeat
  };
};

function interpolate(str: string, data: any): string {
  return str.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split(".");
    let val: any = data;
    for (const k of keys) val = val?.[k];
    return val == null ? "" : String(val);
  });
}

function deepTemplate(node: any, data: any): any {
  if (typeof node === "string") return interpolate(node, data);
  if (typeof node !== "object" || node === null) return node;

  const out: any = Array.isArray(node) ? [] : {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = deepTemplate(v, data);
  }
  return out;
}

export async function resolvePageJSON(node: JSONNode): Promise<JSONNode> {
  // If node has a dataSource, fetch content and expand children from template
  if (node.dataSource) {
    const {
      type,
      query = {},
      sort = {},
      limit = 50,
      template,
    } = node.dataSource;

    const ct = await ContentType.findOne({ slug: type }).lean<ContentTypeDoc>();
    if (!ct) {
      return {
        ...node,
        children: [
          {
            component: "Paragraph",
            children: [`Missing content type: ${type}`],
          },
        ],
      };
    }
    const Model = getContentModel(ct);
    const items = await Model.find(query).sort(sort).limit(limit).lean();

    const repeatedChildren = items.map((doc: any) =>
      deepTemplate(template, doc)
    );
    // Replace node children with repeated templates
    const { dataSource, ...rest } = node;
    return { ...rest, children: repeatedChildren };
  }

  // Recurse into children
  const children = await Promise.all(
    (node.children || []).map(async (ch) => {
      if (typeof ch === "object") return resolvePageJSON(ch);
      return ch as any;
    })
  );
  return { ...node, children };
}
