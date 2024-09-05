import { BasePropertyProps } from "adminjs";
import React from "react";

const PhotoPreview: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const imageUrl = record?.params?.image_url;

  if (!imageUrl) {
    return <p>No image available</p>;
  }

  return (
    <div>
      <img
        src={`/uploads/${imageUrl}`}
        alt="Image Preview"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default PhotoPreview;
