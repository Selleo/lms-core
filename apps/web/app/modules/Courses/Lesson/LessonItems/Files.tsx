import { Card } from "~/components/ui/card";
import Presentation from "./Presentation";

type TProps = {
  content: {
    id: string;
    title: string;
    type: string;
    url: string;
  };
};

export default function Files({ content }: TProps) {
  const isPresentation = content.type === "presentation";

  return (
    <Card className="flex flex-col gap-4 p-8">
      <div className="h6 text-neutral-950">{content.title}</div>
      {isPresentation ? <Presentation url={content.url} /> : <div>VIDEO</div>}
    </Card>
  );
}
