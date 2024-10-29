import Viewer from "~/components/RichText/Viever";
import { Card } from "~/components/ui/card";

type TextBlockProps = {
  content: {
    id: string;
    title: string;
    body: string;
    state?: string;
    archived?: boolean;
  };
};

export const TextBlock = ({ content: { title, body } }: TextBlockProps) => {
  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="h6 text-neutral-950">{title}</div>
      <Viewer content={body} />
    </Card>
  );
};
