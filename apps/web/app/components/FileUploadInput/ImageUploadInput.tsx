import React from "react";

import { Icon } from "../Icon";

interface ImageUploadProps {
  field: { value?: string };
  handleImageUpload: (file: File) => void;
  isUploading: boolean;
  imageUrl?: string;
}

const ImageUploadInput = ({ field, handleImageUpload, isUploading }: ImageUploadProps) => {
  return (
    <div className="flex items-center justify-center flex-col gap-y-2">
      <div className="w-full h-[20rem] border-solid border-2 border-gray-300 flex justify-center items-center bg-gray-100 relative cursor-pointer overflow-hidden flex-col">
        {field.value && (
          <img src={field.value} alt="Uploaded" className="w-full h-full object-cover" />
        )}

        {!field.value && (
          <div>
            <Icon name="UploadImageIcon" />
          </div>
        )}

        {!field.value && (
          <div className="flex items-center justify-center">
            <span className="text-blue-500 text-lg font-semibold">Click to upload</span>
            <span className="text-black text-lg font-semibold ml-2">or drag and drop</span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {!field.value && (
          <div className="text-center mt-2 text-gray-600 text-sm w-full px-2">
            SVG, PNG, JPG or GIF (max. 20MB)
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadInput;
