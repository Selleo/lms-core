import Viewer from "~/components/RichText/Viever";
import { Card } from "~/components/ui/card";

type TProps = {
  content: {
    id: string;
    title: string;
    body: string;
    state?: string;
    archived?: boolean;
  };
};

export default function TextBlock({ content }: TProps) {
  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="h6 text-neutral-950">{content.title}</div>
      <Viewer content={content.body} style="prose" />
    </Card>
  );
}
