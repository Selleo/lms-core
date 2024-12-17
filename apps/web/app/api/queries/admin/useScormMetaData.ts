import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetScormMetadataResponse } from "~/api/generated-api";

type ScormMetadataQueryOptions = {
  id: string;
  isScorm?: boolean;
};

export const scormMetadataQueryOptions = ({ id, isScorm = false }: ScormMetadataQueryOptions) =>
  queryOptions({
    enabled: isScorm,
    queryKey: ["scorm-meta", "admin", { id }],
    queryFn: async () => {
      const response = await ApiClient.api.scormControllerGetScormMetadata(id);
      return response.data;
    },
    select: (data: GetScormMetadataResponse) => data.data,
  });

export function useScormMetadata({ id, isScorm }: ScormMetadataQueryOptions) {
  return useQuery(scormMetadataQueryOptions({ id, isScorm }));
}

export function useScormMetadataSuspense({ id, isScorm }: ScormMetadataQueryOptions) {
  return useSuspenseQuery(scormMetadataQueryOptions({ id, isScorm }));
}
