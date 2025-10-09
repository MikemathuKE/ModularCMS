import { homePageJSON } from "@/examples/homePage";
import { renderJSONNode } from "@/renderer/JsonRenderer";

export default function HomePage() {
  return <>{renderJSONNode(homePageJSON)}</>;
}
