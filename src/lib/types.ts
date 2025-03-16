export interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "number" | "radio" | "checkbox" | "date" | "group";
  options?: string[];
  required?: boolean;
  dynamicOptions?: { dependsOn: string; endpoint: string; method: string };
  validation?: { pattern?: string; min?: number; max?: number };
  visibility?: { dependsOn: string; condition: string; value: string };
  fields?: FormField[];
}

export interface FormStructure {
  formId: string;
  title: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  [key: string]: any;
}
