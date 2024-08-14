import React, { useState } from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input.js";
import { Button } from "~/components/ui/button.js";
import { UploadAlertDialogProps, UploadFileProps } from "../index.js";

export const UploadFileDialog = ({
  setUploadMethod,
  handleFileChange,
  field,
}: UploadAlertDialogProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<FileList | null>(null);
  const [videoError, setVideoError] = useState<string>("");

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Video File</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a video file to upload.
            <div className="mt-4">
              <Input
                type="file"
                accept="video/*"
                className="cursor-pointer mt-2"
                onChange={(e) => {
                  field.onChange(e.target.files);
                  setSelectedVideo(e.target.files);
                  setVideoError("");
                }}
              />
              {videoError !== "" && (
                <span className="text-red-600	">{videoError}</span>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setUploadMethod({
                text: "Upload Video",
                method: "",
              });
              setIsOpen(false);
              setSelectedVideo(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={() => {
              if (selectedVideo) {
                setUploadMethod({
                  text: "Upload Video",
                  method: "",
                });
                setIsOpen(false);
                handleFileChange(selectedVideo);
                setSelectedVideo(null);
              } else {
                setVideoError("video file is required");
                setIsOpen(true);
              }
            }}
          >
            Upload
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const UploadFile: React.FC<UploadFileProps> = ({ setUploadMethod }) => {
  return (
    <DropdownMenuItem
      onSelect={() =>
        setUploadMethod({
          text: "Upload video file",
          method: "sendFile",
        })
      }
    >
      Upload video file
    </DropdownMenuItem>
  );
};
