import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
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
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { type UploadAlertDialogProps, type UploadFileProps } from "../LessonItemsForms/types";

import type React from "react";

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
        method: "internet",
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
          <AlertDialogTitle>Upload Video From URL</AlertDialogTitle>
          <AlertDialogDescription>
            Paste Video URL
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

export const UploadFromInternet: React.FC<UploadFileProps> = ({ setUploadMethod }) => {
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
