import { Box, Label } from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";
import React from "react";
import { getUrlKey } from "./utils.js";

const PhotoPreview: React.FC<BasePropertyProps> = ({
  resource,
  record,
  where,
}) => {
  const isShow = where === "show";
  const urlKey = getUrlKey(resource.name);

  const filePath =
    process.env.NODE_ENV === "production"
      ? record?.params?.filePath
      : `/uploads/${record?.params?.[urlKey]}`;

  const isEmpty = !filePath || filePath.includes("null");

  return (
    <Box style={{ marginBottom: isShow ? "24px" : "0" }}>
      {isShow && (
        <Label style={{ fontWeight: 300, textTransform: "capitalize" }}>
          Current Thumbnail:
        </Label>
      )}
      {isEmpty ? (
        <p>No thumbnail available</p>
      ) : (
        <img
          src={filePath}
          alt="Thumbnail Preview"
          style={{ maxWidth: isShow ? "100%" : "50px", height: "auto" }}
        />
      )}
    </Box>
  );
};

export default PhotoPreview;
