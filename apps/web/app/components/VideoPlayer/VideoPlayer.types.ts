export type VideoPlayerProps = {
  url: string | null;
  onVideoEnded?: () => void;
  isExternalUrl?: boolean;
};
