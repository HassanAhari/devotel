"use client";

import { fetchAPI } from "@/lib/api";
import { FormField, FormStructure } from "@/lib/types";
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Collapse,
  Space,
  InputNumber,
  Button,
  notification,
} from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { updateFormData } from "@/redux/slices/formSlice";

const { Option } = Select;

interface DynamicFormProps {
  formStructure: FormStructure;
}

interface FieldData {
  name: (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const close = () => {};

export default function DynamicForm({ formStructure }: DynamicFormProps) {
  const t = useTranslations("InsuranceFormsPage");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.form.formData);
  const [api, contextHolder] = notification.useNotification();
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: string[];
  }>({});

  const [dynamicLoading, setDynamicLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchDynamicOptions = async (
    field: FormField,
    dependentValue: string
  ) => {
    if (!field.dynamicOptions || !dependentValue) return;

    setDynamicLoading((prev) => ({ ...prev, [field.id]: true }));

    try {
      const data: any = await fetchAPI(
        `${field.dynamicOptions.endpoint}?${field.dynamicOptions.dependsOn}=${dependentValue}`,
        {
          method: field.dynamicOptions.method,
        }
      );
      setDynamicOptions((prev) => ({
        ...prev,
        [field.id]: data["states"],
      }));
    } catch (error) {
      console.error(`Error fetching options for ${field.id}:`, error);
    } finally {
      setDynamicLoading((prev) => ({ ...prev, [field.id]: false }));
    }
  };

  const fetchSubmitForm = async () => {
    try {
      const formValues = form.getFieldsValue();

      const submissionData = {
        formId: formStructure.formId,
        data: formValues,
      };

      const response: any = await fetchAPI("/api/insurance/forms/submit", {
        method: "POST",
        body: JSON.stringify(submissionData),
      });

      const key = `open${Date.now()}`;
      api.success({
        message: "Submission Successful",
        description: response.message,
        key,
        onClose: close,
      });

      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderFormField = (field: FormField) => {
    // dynamicOptions
    const isDynamicField =
      field.dynamicOptions && field.dynamicOptions.dependsOn;
    const dependentFieldName = isDynamicField
      ? formStructure.formId + "." + field.dynamicOptions!.dependsOn
      : "";
    const dependentValue = formData[dependentFieldName];
    const isLoading = dynamicLoading[field.id] || false;
    const isDisabled = isDynamicField && (!dependentValue || isLoading);

    // visibility
    const visibilityDependsOn = field.visibility?.dependsOn;
    const visibilityCondition = field.visibility?.condition;
    const visibilityValue = field.visibility?.value;
    const visibilityFieldName = visibilityDependsOn
      ? formStructure.formId + "." + visibilityDependsOn
      : "";
    const visibilityDependentValue = formData[visibilityFieldName];
    let isVisible = true;
    if (
      visibilityDependsOn &&
      visibilityCondition &&
      visibilityValue !== undefined
    ) {
      if (visibilityCondition === "equals") {
        isVisible = visibilityDependentValue === visibilityValue;
      }
    }
    if (!isVisible) {
      return null;
    }

    // rules
    const getValidationRules = () => {
      const rules: any[] = [];

      if (field.required) {
        rules.push({ required: true, message: `${field.label} is required` });
      }

      if (field.validation) {
        const { min, max, pattern } = field.validation;

        if (min !== undefined) {
          rules.push({
            type: field.type === "number" ? "number" : "string",
            min,
            message: `${field.label} must be at least ${min}`,
          });
        }

        if (max !== undefined) {
          rules.push({
            type: field.type === "number" ? "number" : "string",
            max,
            message: `${field.label} must not exceed ${max}`,
          });
        }

        if (pattern) {
          rules.push({
            pattern: new RegExp(pattern),
            message: `${field.label} does not match the required format`,
          });
        }
      }

      return rules;
    };

    const renderFormInput = () => {
      switch (field.type) {
        case "text":
          return <Input key={field.id} />;
        case "number":
          return <InputNumber key={field.id} />;
        case "select":
          const options =
            field.dynamicOptions && dynamicOptions[field.id]
              ? dynamicOptions[field.id]
              : field.options || [];
          return (
            <Select
              key={field.id}
              loading={isLoading}
              disabled={isDisabled as boolean}
              placeholder={
                isDynamicField && !dependentValue
                  ? `Select ${field.dynamicOptions!.dependsOn} first`
                  : undefined
              }
            >
              {options.map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          );
        case "radio":
          return (
            <Radio.Group key={field.id}>
              {field.options?.map((opt) => (
                <Radio key={opt} value={opt}>
                  {opt}
                </Radio>
              ))}
            </Radio.Group>
          );
        case "checkbox":
          return (
            <Checkbox.Group key={field.id}>
              {field.options?.map((opt) => (
                <Checkbox key={opt} value={opt}>
                  {opt}
                </Checkbox>
              ))}
            </Checkbox.Group>
          );
        case "date":
          return <DatePicker key={field.id} format="YYYY-MM-DD" />;
        case "group":
          return (
            <Collapse
              key={field.id}
              defaultActiveKey={field.type === "group" ? [field.id] : []}
              items={[
                {
                  key: field.id,
                  label: field.label,
                  children: field.fields?.map((subField) =>
                    renderFormField(subField)
                  ),
                },
              ]}
            ></Collapse>
          );
        default:
          return null;
      }
    };

    if (field.type === "group") {
      return renderFormInput();
    }

    return (
      <Form.Item
        key={field.id}
        name={field.id}
        label={field.label}
        required={field.required}
        rules={getValidationRules()}
      >
        {renderFormInput()}
      </Form.Item>
    );
  };

  return (
    <>
      {contextHolder}
      <Form
        name={formStructure.formId}
        form={form}
        layout="horizontal"
        initialValues={formData}
        onFieldsChange={(
          changedFields: FieldData[],
          allFields: FieldData[]
        ) => {
          if (changedFields.length > 1) return;

          const updatedData = changedFields.reduce((acc, field) => {
            const fieldName =
              formStructure.formId + "." + field.name[field.name.length - 1];
            let value = field.value;

            const findFieldType = (fields: FormField[]): string | undefined => {
              for (const f of fields) {
                if (f.id === field.name[field.name.length - 1]) return f.type;
                if (f.type === "group" && f.fields) {
                  const nestedType = findFieldType(f.fields);
                  if (nestedType) return nestedType;
                }
              }
              return undefined;
            };

            const fieldType = findFieldType(formStructure.fields);
            if (fieldType === "date" && value) {
              value = value.toString();
            }

            acc[fieldName] = value;
            return acc;
          }, {} as { [key: string]: any });

          dispatch(updateFormData(updatedData));

          // dynamicOptions
          changedFields.forEach((changedField) => {
            const changedId = changedField.name[changedField.name.length - 1];
            const changedValue = changedField.value;

            const processFields = (fields: FormField[], value: any) => {
              fields.forEach((field) => {
                if (field.type === "group" && field.fields) {
                  processFields(field.fields, value);
                } else if (
                  field.dynamicOptions &&
                  field.dynamicOptions.dependsOn === changedId
                ) {
                  const fieldFullId = `${formStructure.formId}.${field.id}`;
                  dispatch(updateFormData({ [fieldFullId]: "" }));
                  form.setFieldsValue({ [field.id]: "" });
                  fetchDynamicOptions(field, value);
                } else if (
                  field.visibility &&
                  field.visibility.dependsOn === changedId
                ) {
                }
              });
            };
            processFields(formStructure.fields, changedValue);
          });
        }}
        onFinish={() => {
          fetchSubmitForm();
        }}
        autoComplete="off"
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {formStructure.fields.map((field) => renderFormField(field))}

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              {t("submit")}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </>
  );
}
