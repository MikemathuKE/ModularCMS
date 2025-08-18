import { aboutPageJSON } from "@/examples/aboutPage";
import { renderJSONNode } from "@/renderer/JsonRenderer";

export default function AboutPage() {
  return <>{renderJSONNode(aboutPageJSON)}</>;
}
