import InsuranceFormLayout from "@/components/forms/InsuranceFormLayout";
import { fetchAPI } from "@/lib/api";
import { FormStructure } from "@/lib/types";

export default async function InsuranceFormsPage() {
  const formStructures: FormStructure[] = await fetchAPI(
    "/api/insurance/forms",
    {
      cache: "no-store",
    }
  );

  return (
    <InsuranceFormLayout formStructures={formStructures}></InsuranceFormLayout>
  );
}
