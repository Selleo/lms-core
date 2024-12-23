import { Pause, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Play } from "~/assets/svgs/actions";
import { cn } from "~/lib/utils";

type VideoPlayerProps = {
  url: string | null;
};

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!url) throw new Error("Something went wrong");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeek = (seconds: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div
      className="group relative w-full"
      role="button"
      tabIndex={0}
      onClick={togglePlay}
      onKeyDown={(event) => {
        if (event.key === " ") {
          togglePlay();
        }
      }}
    >
      <video ref={videoRef} width="100%" height="auto" onEnded={() => setIsPlaying(false)}>
        <source src={url} />
        <track kind="captions" />
      </video>

      <div
        className={cn("absolute inset-0 bg-black transition-opacity duration-200", {
          "opacity-48": !isPlaying,
          "opacity-0 group-hover:opacity-48": isPlaying,
        })}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-20 transition-opacity duration-200",
          {
            "opacity-0 group-hover:opacity-100": isPlaying,
            "opacity-100": !isPlaying,
          },
        )}
      >
        <button
          onClick={handleSeek(-10)}
          className="relative rounded-full p-4 transition-transform duration-200 hover:scale-110"
        >
          <div className="absolute inset-0 bg-white opacity-32 rounded-full" />
          <SkipBack className="relative z-10 w-8 h-8 text-white" />
        </button>

        <button
          onClick={togglePlay}
          className="relative rounded-full p-4 transition-transform duration-200 hover:scale-110"
        >
          <div className="absolute inset-0 bg-white opacity-32 rounded-full" />
          {isPlaying ? (
            <Pause className="relative z-10 w-8 h-8 text-white" />
          ) : (
            <Play className="relative z-10 w-8 h-8 text-white" />
          )}
        </button>

        <button
          onClick={handleSeek(10)}
          className="relative rounded-full p-4 transition-transform duration-200 hover:scale-110"
        >
          <div className="absolute inset-0 bg-white opacity-32 rounded-full" />
          <SkipForward className="relative z-10 w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};
