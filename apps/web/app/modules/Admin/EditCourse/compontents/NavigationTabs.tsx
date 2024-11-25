import * as Tabs from "@radix-ui/react-tabs";

import type { NavigationTab } from "../EditCourse.types";

type NavigationTabsProps = {
  setNavigationTabState: (navigationTabState: NavigationTab) => void;
};

const NavigationTabs = ({ setNavigationTabState }: NavigationTabsProps) => {
  const handleValueChange = (value: string) => {
    setNavigationTabState(value as NavigationTab);
  };

  return (
    <Tabs.Root className="flex flex-col" defaultValue="Settings" onValueChange={handleValueChange}>
      <Tabs.List className="flex items-center gap-5 border-b border-gray-200">
        <Tabs.Trigger
          className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          value="Settings"
        >
          Settings
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          value="Lesson"
        >
          Lesson
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          value="Pricing"
        >
          Pricing
        </Tabs.Trigger>
        <Tabs.Trigger
          className="text-gray-700 hover:text-black text-lg px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black"
          value="Status"
        >
          Status
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default NavigationTabs;
