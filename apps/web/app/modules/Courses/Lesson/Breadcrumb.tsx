import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  console.log({ params });

  const data = "test";
  return { data };
};

export default function Breadcrumb() {
  const data = useLoaderData<typeof clientLoader>();
  console.log({ data });

  return <div>Breadcrumb</div>;
}
