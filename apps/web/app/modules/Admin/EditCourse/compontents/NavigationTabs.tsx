import * as Tabs from "@radix-ui/react-tabs";

import type { NavigationTab } from "../EditCourse.types";
import { useTranslation } from "react-i18next";

type NavigationTabsProps = {
  setNavigationTabState: (navigationTabState: NavigationTab) => void;
};

const TabTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <Tabs.Trigger
    className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:text-primary-800 data-[state=active]:border-none"
    value={value}
  >
    {children}
  </Tabs.Trigger>
);

const NavigationTabs = ({ setNavigationTabState }: NavigationTabsProps) => {
  const { t } = useTranslation();
  const handleValueChange = (value: string) => {
    setNavigationTabState(value as NavigationTab);
  };

  return (
    <Tabs.Root
      className="flex flex-col"
      defaultValue="Curriculum"
      onValueChange={handleValueChange}
    >
      <Tabs.List className="flex items-center gap-5 border-b border-gray-200">
        <TabTrigger value="Settings">{t("adminCourseView.common.settings")}</TabTrigger>
        <TabTrigger value="Curriculum">{t("adminCourseView.common.curriculum")}</TabTrigger>
        <TabTrigger value="Pricing">{t("adminCourseView.common.pricing")}</TabTrigger>
        <TabTrigger value="Status">{t("adminCourseView.common.status")}</TabTrigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default NavigationTabs;
