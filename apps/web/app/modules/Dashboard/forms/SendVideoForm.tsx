import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface IFormInput {
  video: FileList;
}
export const SendVideoForm = ({
  setVideoList,
}: {
  setVideoList: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (data && data.video) {
      setVideoList((prev) => [...prev, data.video[0]]);
      reset();
    } else {
      console.error("Data does not contain video property", data);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="file"
        accept="video/*"
        className="cursor-pointer"
        {...register("video", { required: "Proszę wybrać plik" })}
      />
      {errors.video && <p>{errors.video.message}</p>}
      <Button type="submit">Wyślij</Button>
    </form>
  );
};
