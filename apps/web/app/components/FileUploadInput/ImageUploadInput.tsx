import { useTranslation } from "react-i18next";

import { cn } from "~/lib/utils";

import { Icon } from "../Icon";

interface ImageUploadProps {
  field: { value?: string };
  handleImageUpload: (file: File) => void;
  isUploading: boolean;
  imageUrl?: string;
}

const ImageUploadInput = ({
  field,
  handleImageUpload,
  isUploading,
  imageUrl,
}: ImageUploadProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center flex-col gap-y-2">
      <div className="w-full h-80 rounded-lg border-solid border-2 border-gray-300 flex justify-center items-center bg-gray-100 relative cursor-pointer overflow-hidden flex-col">
        {field.value && (
          <img
            src={imageUrl || field.value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        )}
        <div
          className={cn("absolute inset-0 flex flex-col items-center justify-center text-center", {
            "text-white": field.value,
          })}
        >
          <Icon name="UploadImageIcon" />

          <div className="flex items-center justify-center mt-2">
            <span className={`text-lg font-semibold text-primary-400`}>
              {field.value ? t("uploadFile.replace") : t("uploadFile.header")}
            </span>
            <span className="ml-2 text-lg font-semibold">{t("uploadFile.subHeader")}</span>
          </div>

          <div
            className={cn("text-sm w-full px-2 mt-2", {
              "text-white": field.value,
              "text-gray-600": !field.value,
            })}
          >
            {field.value ? "SVG, PNG, JPG (max. to 20MB)" : "SVG, PNG, JPG or GIF (max. 800x400px)"}
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default ImageUploadInput;
