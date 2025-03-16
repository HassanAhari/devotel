"use client";

import { Flex, Layout, Space, theme, Typography } from "antd";
import ThemeToggleButton from "./ThemeToggleButton";
import LocaleSwitcher from "./LocaleSwitcher";
import Image from "next/image";
import devotel from "../../public/logo.svg";
import Link from "next/link";
import { Footer } from "antd/es/layout/layout";

const { Header } = Layout;
const { Text } = Typography;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ background: colorBgContainer, padding: "0 16px" }}>
        <Flex justify="space-between" align="center">
          <Link href={"/"}>
            <Flex align="center">
              <Image src={devotel} height={36} alt="logo" />
            </Flex>
          </Link>
          <Space>
            <ThemeToggleButton />
            <LocaleSwitcher />
          </Space>
        </Flex>
      </Header>
      {children}
    </Layout>
  );
}
