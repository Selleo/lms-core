import uploadFeature from "@adminjs/upload";
import { componentLoader } from "../../components/index.js";
import { providerConfig } from "../uploadProviderConfig.js";

export const uploadFile = (
  resourceName: string,
  filedName: string,
  size: number,
  mimeTypes: string[],
) =>
  uploadFeature({
    componentLoader: componentLoader,
    provider: providerConfig,
    properties: {
      key: filedName,
    },
    validation: {
      mimeTypes: mimeTypes,
      maxSize: size * 1024 * 1024,
    },
    uploadPath: (record, filename) => {
      const id = record.id();
      if (!id) {
        throw new Error("Record ID is required for file upload.");
      }
      return `${resourceName}/${id}/${filename}`;
    },
  });
