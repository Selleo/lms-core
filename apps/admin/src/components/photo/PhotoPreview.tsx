import { BasePropertyProps } from "adminjs";
import React from "react";

const PhotoPreview: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;

  const filePath =
    process.env.NODE_ENV === "production"
      ? record?.params?.filePath
      : `/uploads/${record?.params?.image_url}`;

  if (!filePath) {
    return <p>No thumbnail available</p>;
  }

  return (
    <div>
      <p>Current Thumbnail:</p>
      <img
        src={filePath}
        alt="Thumbnail Preview"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default PhotoPreview;
