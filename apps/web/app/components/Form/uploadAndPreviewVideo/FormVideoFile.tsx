/* eslint-disable jsx-a11y/media-has-caption */
export const FormVideoFile = ({
  videoFile,
  videoURL,
}: {
  videoFile: File;
  videoURL: string;
}) => {
  return (
    <div className="w-full" key={videoFile.name}>
      <video controls className="w-full">
        <source
          src={videoURL}
          type={
            videoFile.type === "video/quicktime" ? "video/mp4" : videoFile.type
          }
        />
      </video>
      <p className="mt-2">{videoFile.name}</p>
    </div>
  );
};
