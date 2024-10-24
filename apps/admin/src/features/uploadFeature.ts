import uploadFeature from "@adminjs/upload";
import { componentLoader } from "../components/index.js";
import { providerConfig } from "../config/uploadProviderConfig.js";

export const uploadFile = (
  resourceName: string,
  fieldName: string,
  size: number,
  mimeTypes: string[],
) => {
  return uploadFeature({
    componentLoader,
    provider: providerConfig,
    properties: {
      key: fieldName,
      file: "file",
    },
    validation: {
      mimeTypes,
      maxSize: size * 1024 * 1024,
    },
    uploadPath: (record, filename) =>
      `${resourceName}/${record.id()}/${filename}`,
  });
};
