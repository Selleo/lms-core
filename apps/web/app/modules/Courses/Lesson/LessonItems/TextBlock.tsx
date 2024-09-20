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
    <div className="flex flex-col gap-4 mb-8">
      <div className="h6 text-neutral-950">{content.title}</div>
      <div
        className="text-neutral-900 body-base"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </div>
  );
}
