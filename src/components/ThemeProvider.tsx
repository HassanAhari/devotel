"use client";

import { ConfigProvider } from "antd";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { lightTheme } from "@/styles/lightTheme";
import { darkTheme } from "@/styles/darkTheme";
import { ThemeConfig } from "antd";
import { useLocale } from "next-intl";

interface ThemeContextType {
  toggleTheme: () => void;
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const locale = useLocale();

  const getInitialTheme = (): ThemeConfig => {
    if (typeof window !== undefined) {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark" ? darkTheme : lightTheme;
    }
    return lightTheme;
  };

  const [currentTheme, setCurrentTheme] =
    useState<ThemeConfig>(getInitialTheme);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => {
      const newTheme = prevTheme === lightTheme ? darkTheme : lightTheme;
      localStorage.setItem("theme", newTheme === darkTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    document.body.style.setProperty(
      "--background",
      currentTheme.token?.colorBgBase || "#ffffff"
    );
    document.body.style.setProperty(
      "--foreground",
      currentTheme.token?.colorTextBase || "#171717"
    );
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, currentTheme }}>
      <ConfigProvider
        theme={currentTheme}
        direction={locale === "fa" ? "rtl" : "ltr"}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
