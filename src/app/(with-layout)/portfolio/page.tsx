import { portfolioPageJSON } from "@/examples/portfolioPage";
import { renderJSONNode } from "@/renderer/JsonRenderer";

export default function PortfolioPage() {
  return <>{renderJSONNode(portfolioPageJSON)}</>;
}
