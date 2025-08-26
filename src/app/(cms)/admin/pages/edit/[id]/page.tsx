"use client";
import { useState, useEffect } from "react";
import { JSONNode } from "@/renderer/JsonRenderer";
import LayoutEditor from "@/components/admin/LayoutEditor";
import { useParams } from "next/navigation";

export default function PageEdit() {
  const params = useParams();
  const pageId = params?.id as string;

  const [rootNode, setRootNode] = useState<JSONNode>({
    component: "",
    props: {},
    children: [],
  });

  useEffect(() => {
    fetch(`/api/cms/pages/${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.json) setRootNode(data.json);
      });
  }, [pageId]);

  return (
    <LayoutEditor
      rootNode={rootNode}
      setRootNode={setRootNode}
      pageId={pageId}
    />
  );
}
