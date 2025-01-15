import { useParams } from "@remix-run/react";
import { startCase } from "lodash-es";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAdminUpdateUser } from "~/api/mutations/admin/useAdminUpdateUser";
import { userQueryOptions, useUserById } from "~/api/queries/admin/useUserById";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import Loader from "~/modules/common/Loader/Loader";

import { UserInfo } from "./UserInfo";

import type { UpdateUserBody } from "~/api/generated-api";

const displayedFields: Array<keyof UpdateUserBody> = [
  "firstName",
  "lastName",
  "email",
  "role",
  "archived",
];

const User = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  if (!id) throw new Error(t("adminUserView.error.userNotFound"));

  const { data: user, isLoading } = useUserById(id);
  const { mutateAsync: updateUser } = useAdminUpdateUser();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateUserBody>();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) throw new Error(t("adminUserView.error.userNotFound"));

  const onSubmit = (data: UpdateUserBody) => {
    updateUser({ data, userId: id }).then(() => {
      queryClient.invalidateQueries(userQueryOptions(id));
    });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-950">
            {t("adminUserView.editUserHeader")}
          </h2>
          <Button type="submit" disabled={!isDirty} className="mr-2">
            {t("common.button.save")}
          </Button>
        </div>
        <div className="space-y-4 pt-4">
          {displayedFields.map((field) => (
            <div key={field} className="flex flex-col gap-y-2">
              <Label className="font-normal text-neutral-600">
                {field === "archived"
                  ? t("adminUserView.field.status")
                  : startCase(t(`adminUserView.field.${field}`))}
              </Label>
              <UserInfo name={field} control={control} isEditing user={user} />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default User;
