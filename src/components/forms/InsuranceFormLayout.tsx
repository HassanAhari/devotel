"use client";

import { FormStructure } from "@/lib/types";
import type { MenuProps } from "antd";
import { Card, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { UnorderedListOutlined } from "@ant-design/icons";
import DynamicForm from "./DynamicForm";
import { useTranslations } from "next-intl";

const { Content, Sider } = Layout;

interface InsuranceFormLayoutProps {
  formStructures: FormStructure[];
}

export default function InsuranceFormLayout({
  formStructures,
}: InsuranceFormLayoutProps) {
  const t = useTranslations("InsuranceFormsPage");
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  const [formSelected, setFormSelected] = useState<FormStructure | undefined>(
    undefined
  );

  type MenuItem = Required<MenuProps>["items"][number];

  const menuItems = formStructures.map((formStructure) => ({
    key: formStructure.formId,
    label: formStructure.title,
    onClick: () => {
      setFormSelected(formStructure);
    },
  }));

  const items: MenuItem[] = [
    {
      key: "1",
      label: t("form_list"),
      icon: <UnorderedListOutlined />,
      children: menuItems,
    },
  ];

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={256}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          background: colorBgContainer,
        }}
      >
        <Menu
          mode="inline"
          items={items}
          selectedKeys={formSelected ? [formSelected.formId] : []}
          defaultOpenKeys={["1"]}
        />
      </Sider>
      <Content
        style={{ background: colorBgLayout, padding: "24px", overflow: "auto" }}
      >
        {formSelected && (
          <Card title={formSelected.title} variant="borderless">
            <DynamicForm formStructure={formSelected} />
          </Card>
        )}
      </Content>
    </Layout>
  );
}
