import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { Select } from "antd";

const { Option } = Select;

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((cur) => (
        <Option key={cur} value={cur}>
          {t("locale", { locale: cur })}
        </Option>
      ))}
    </LocaleSwitcherSelect>
  );
}
