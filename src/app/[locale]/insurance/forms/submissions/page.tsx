import SubmissionsTable from "@/components/submissions/SubmissionsTable";
import { fetchAPI } from "@/lib/api";
import { Submission } from "@/lib/types";
import { Content } from "antd/es/layout/layout";

export default async function SubmissionsPage() {
  const {
    data,
    columns: columnNames,
  }: { data: Submission[]; columns: string[] } = await fetchAPI(
    "/api/insurance/forms/submissions",
    {
      cache: "no-store",
    }
  );

  return (
    <Content style={{ padding: "24px", overflow: "auto" }}>
      <SubmissionsTable data={data} columnNames={columnNames} />
    </Content>
  );
}
