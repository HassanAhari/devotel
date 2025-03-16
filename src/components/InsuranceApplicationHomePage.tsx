"use client";

import { Card, Col, Layout, Row, theme, Typography } from "antd";
import { useTranslations } from "next-intl";

const { Content } = Layout;
const { Title, Link } = Typography;

export default function InsuranceApplicationHomePage() {
  const t = useTranslations("HomePage");
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  return (
    <Layout>
      <Content
        style={{
          background: colorBgLayout,
          padding: "24px",
          overflow: "auto",
        }}
      >
        <Title>{t("title")}</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card
              variant="borderless"
              actions={[
                <Link key={"action"} href="/insurance/forms">
                  {t("form.action")}
                </Link>,
              ]}
            >
              <Title level={5} style={{ padding: 0, margin: 0 }}>
                {t("form.title")}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              variant="borderless"
              actions={[
                <Link key={"action"} href="/insurance/forms/submissions">
                  {t("submission.action")}
                </Link>,
              ]}
            >
              <Title level={5} style={{ padding: 0, margin: 0 }}>
                {t("submission.title")}
              </Title>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
