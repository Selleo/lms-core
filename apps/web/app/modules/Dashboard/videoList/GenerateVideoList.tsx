import React, { useMemo } from "react";

export const GenerateVideoList = ({ videoList }: { videoList: File[] }) => {
  const movieList = useMemo(
    () =>
      videoList.length > 0 ? (
        <ul>
          {videoList.map((vod: File, index: number) => {
            const videoType =
              vod.type === "video/quicktime" ? "video/mp4" : vod.type;
            return (
              <li key={index}>
                <video controls>
                  <source src={URL.createObjectURL(vod)} type={videoType} />
                  <track
                    src="./vtt/captions_en.vtt"
                    kind="captions"
                    srcLang="en"
                    label="English captions"
                  />
                </video>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Video not available</p>
      ),
    [videoList]
  );

  return <>{movieList}</>;
};
