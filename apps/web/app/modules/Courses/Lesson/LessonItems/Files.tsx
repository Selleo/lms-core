import { Card } from "~/components/ui/card";
import Presentation from "./Presentation";
import Video from "./Video";

type TProps = {
  content: {
    id: string;
    title: string;
    type: string;
    url: string;
  };
};

export default function Files({ content }: TProps) {
  const isPresentation =
    content.type === "presentation" || content.type === "external_presentation";
  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="h6 text-neutral-950">{content.title}</div>
      {isPresentation ? (
        <Presentation url={content.url} presentationId={content.id} />
      ) : (
        <Video url={content.url} videoId={content.id} />
      )}
    </Card>
  );
}
