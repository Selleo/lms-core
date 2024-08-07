import React, { useState } from "react";
import ReactPlayer from "react-player";
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
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export const UploadFromInternetDialog = ({
  setUploadMethod,
  handleFileChange,
  field,
}: UploadAlertDialogProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [videoError, setVideoError] = useState<string>("");

  const handleUpload = () => {
    if (ReactPlayer.canPlay(youtubeUrl)) {
      setUploadMethod({
        text: "Upload Video",
        method: "youtube",
      });
      setIsOpen(false);
      handleFileChange(youtubeUrl);
      setYoutubeUrl("");
    } else {
      setVideoError("Invalid video URL");
      setIsOpen(true);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Video File</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a video file to upload.
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Enter the URL of the video"
                className="mt-2"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  field.onChange(e.target.value);
                }}
              />
              {videoError && <span className="text-red-600">{videoError}</span>}
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
              setYoutubeUrl("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleUpload}>Upload</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const UploadFromInternet: React.FC<UploadFileProps> = ({
  setUploadMethod,
}) => {
  return (
    <DropdownMenuItem
      onSelect={() =>
        setUploadMethod({
          text: "Upload from internet",
          method: "internet",
        })
      }
    >
      Upload from internet
    </DropdownMenuItem>
  );
};
