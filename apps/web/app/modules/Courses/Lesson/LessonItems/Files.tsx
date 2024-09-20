import { Card } from "~/components/ui/card";

type TProps = {
  content: {
    id: string;
    title: string;
    type: string;
    url: string;
  };
};

export default function Files({ content }: TProps) {
  return (
    <Card className="flex p-8">
      <p>FILES TYPE:</p>
      <div>{content.title}</div>;
    </Card>
  );
}
