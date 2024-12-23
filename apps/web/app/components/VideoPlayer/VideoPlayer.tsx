import { Pause } from "lucide-react";
import { useRef, useState } from "react";

import { Play } from "~/assets/svgs/actions";
import { cn } from "~/lib/utils";

type VideoPlayerProps = {
  url: string | null;
};

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!url) throw new Error("Something went wrong");

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className={cn("relative w-full", "before:absolute before:inset-0 before:rounded-lg", {
        "before:bg-black before:opacity-48": !isPlaying,
        "hover:before:bg-black hover:before:opacity-48": isPlaying,
      })}
    >
      <video
        ref={videoRef}
        width="100%"
        height="auto"
        className="rounded-lg"
        onEnded={() => setIsPlaying(false)}
        controls
      >
        <source src={url} />
        <track kind="captions" />
      </video>

      <button
        onClick={togglePlay}
        className={cn(
          "absolute inset-0 flex items-center justify-center w-full transition-opacity duration-200",
          {
            "opacity-0 hover:opacity-100": isPlaying,
            "opacity-100": !isPlaying,
          },
        )}
      >
        <div className="relative rounded-full p-4 transition-transform duration-200 hover:scale-110">
          <div className="absolute inset-0 bg-white opacity-32 rounded-full" />
          {isPlaying ? (
            <Pause className="relative z-10 w-8 h-8 text-black" />
          ) : (
            <Play className="relative z-10 w-8 h-8 text-white" />
          )}
        </div>
      </button>
    </div>
  );
};
