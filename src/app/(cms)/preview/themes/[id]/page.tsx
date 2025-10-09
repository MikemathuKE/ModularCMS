"use client";

import React from "react";
import { useParams } from "next/navigation";

import ExampleForm from "@/examples/FormExample";
import { Heading2, Paragraph } from "@/components/GeneralComponents";

import { Section, Card } from "@/components/LayoutComponents";
import ExampleGrid from "@/examples/GridExample";
import ExampleMedia from "@/examples/MediaExample";
import { ExampleTable } from "@/examples/TableExample";
import { ThemeProvider } from "@/context/ThemeContext";
import DynamicLayout from "@/theme/DynamicLayout";

const Layout = () => {
  const { id }: { id: string } = useParams();

  return (
    <ThemeProvider themeIdentifier={id}>
      <DynamicLayout themeId={id}>
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
          <ExampleTable />
        </Section>

        <Section>
          <ExampleMedia />
        </Section>

        <Section>
          <Card>
            <ExampleForm />
          </Card>
        </Section>
      </DynamicLayout>
    </ThemeProvider>
  );
};

export default Layout;
