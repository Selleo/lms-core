import { Card } from "~/components/ui/card";

type TProps = {
  content: {
    id: string;
    title: string;
    body: string;
    state: string;
  };
};

export default function TextBlock({ content }: TProps) {
  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="h6 text-neutral-950">{content.title}</div>
      <div
        className="text-neutral-900 body-base"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </Card>
  );
}
