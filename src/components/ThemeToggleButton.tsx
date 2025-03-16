"use client";

import { Switch } from "antd";
import { useTheme } from "./ThemeProvider";
import { MoonFilled, SunFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";

export default function ThemeToggleButton() {
  const { toggleTheme } = useTheme();
  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setIsLight(savedTheme !== "dark");
    }
  }, []);

  const handleChange = (checked: boolean) => {
    toggleTheme();
    setIsLight(checked);
  };

  return (
    <Switch
      checked={isLight}
      checkedChildren={<SunFilled />}
      unCheckedChildren={<MoonFilled />}
      onChange={handleChange}
    />
  );
}
