import * as Tabs from "@radix-ui/react-tabs";

import type { NavigationTab } from "../EditCourse.types";

type NavigationTabsProps = {
  setNavigationTabState: (navigationTabState: NavigationTab) => void;
};

const TabTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <Tabs.Trigger
    className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
    value={value}
  >
    {children}
  </Tabs.Trigger>
);

const NavigationTabs = ({ setNavigationTabState }: NavigationTabsProps) => {
  const handleValueChange = (value: string) => {
    setNavigationTabState(value as NavigationTab);
  };

  return (
    <Tabs.Root className="flex flex-col" defaultValue="Lesson" onValueChange={handleValueChange}>
      <Tabs.List className="flex items-center gap-5 border-b border-gray-200">
        <TabTrigger value="Settings">Settings</TabTrigger>
        <TabTrigger value="Lesson">Curriculum</TabTrigger>
        <TabTrigger value="Pricing">Pricing</TabTrigger>
        <TabTrigger value="Status">Status</TabTrigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default NavigationTabs;
