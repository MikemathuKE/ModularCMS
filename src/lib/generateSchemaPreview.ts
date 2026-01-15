// lib/contentTypePreview.ts
export function generateSchemaPreview(
  fields: {
    name: string;
    kind: string;
    type?: string;
    required?: boolean;
    fields?: any[];
    of?: any;
  }[]
) {
  const example: Record<string, any> = {};

  for (const field of fields) {
    switch (field.type) {
      case "string":
      case "text":
      case "email":
        example[field.name] = "example";
        break;
      case "number":
        example[field.name] = 123;
        break;
      case "boolean":
        example[field.name] = true;
        break;
      case "date":
        example[field.name] = new Date().toISOString();
        break;
      case "image":
        example[field.name] = { url: "https://example.com/image.jpg" };
        break;
      default: {
        switch (field.kind) {
          case "list":
            example[field.name] = field.of
              ? [generateSchemaPreview([field.of])[field.of.name]]
              : [];
            break;
          case "object":
            example[field.name] = field.fields
              ? generateSchemaPreview(field.fields)
              : {};
            break;
          default:
            example[field.name] = null;
        }
      }
    }
  }

  return example;
}
