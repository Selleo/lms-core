import MultipleSelector, { Option } from "~/components/ui/multiple-selector";
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useDebounce } from "../hooks/useDebounce";

interface MultipleSelectOptionsInterface {
  [key: string]: Option[];
}

const multipleSelectOptions: MultipleSelectOptionsInterface = {
  role: [
    { label: "Tutor", value: "tutor" },
    { label: "Admin", value: "admin" },
  ],
  status: [
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ],
};

const defaultRoleValue: Option[] = [
  { label: "Tutor", value: "tutor" },
  { label: "Admin", value: "admin" },
];
const defaultStatusValue: Option[] = [{ label: "Active", value: "active" }];
const defaultSearchValue: string = "";

export const UserTableFilter = () => {
  const [roleValue, setRoleValue] = useState<Option[]>(defaultRoleValue);
  const [statusValue, setStatusValue] = useState<Option[]>(defaultStatusValue);
  const [searchValue, setSearchValue] = useState<string>(defaultSearchValue);

  const onCancel = () => {
    setRoleValue(defaultRoleValue);
    setStatusValue(defaultStatusValue);
    setSearchValue(defaultSearchValue);
  };

  const isResetVisible =
    roleValue !== defaultRoleValue ||
    statusValue !== defaultStatusValue ||
    searchValue !== defaultSearchValue;

  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      console.log("Debounced Search Value:", debouncedSearchValue);
    }
  }, [debouncedSearchValue]);

  return (
    <div className="flex justify-start w-3/5 gap-4">
      <Input
        placeholder="Search by name"
        value={searchValue}
        onChange={handleSearchValueChange}
      />
      <MultipleSelector
        value={roleValue}
        onChange={setRoleValue}
        defaultOptions={multipleSelectOptions.role}
        hideClearAllButton
        placeholder="Filtr by role"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
      <MultipleSelector
        value={statusValue}
        onChange={setStatusValue}
        defaultOptions={multipleSelectOptions.status}
        hideClearAllButton
        placeholder="Filtr by status"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
      {isResetVisible && <Button onClick={onCancel}>Reset</Button>}
    </div>
  );
};
