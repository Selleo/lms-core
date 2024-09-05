import React, { useState } from "react";
import { BasePropertyProps } from "adminjs";

const PhotoUpload: React.FC<BasePropertyProps> = (props) => {
  const { onChange, property, record } = props;
  const [_file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);

    if (onChange && selectedFile) {
      onChange(property.name, selectedFile);
    }
  };

  const imageUrl = record?.params?.[property.name];

  return (
    <div>
      {imageUrl && (
        <div>
          <p>Current Image:</p>
          <img
            src={`/uploads/${imageUrl}`}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default PhotoUpload;
