"use client";

import React from "react";

import ExampleForm from "@/examples/FormExample";
import { Heading2, Paragraph, Heading3 } from "@/components/GeneralComponents";

import { Section, Card } from "@/components/LayoutComponents";
import { ImageMedia } from "@/components/MediaComponents";
import ExampleGrid from "@/examples/GridExample";
import ExampleMedia from "@/examples/MediaExample";

const Layout = () => {
  return (
    <div>
      <Section>
        <Heading2>Welcome to the Dashboard</Heading2>
        <Paragraph>
          This is a responsive layout with a sidebar, and topbar.
        </Paragraph>
      </Section>

      <Section>
        <ExampleGrid />
      </Section>

      <Section>
        <ExampleMedia />
      </Section>

      <Section>
        <Card>
          <ExampleForm />
        </Card>
      </Section>
    </div>
  );
};

export default Layout;
