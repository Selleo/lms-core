import ReactPlayer from "react-player";

export const FormVideoURL = ({ videoFile }: { videoFile: string }) => {
  return (
    <div className="w-full" key={videoFile}>
      <ReactPlayer url={videoFile} controls className="w-full" />
      <p className="mt-2">{videoFile}</p>
    </div>
  );
};
