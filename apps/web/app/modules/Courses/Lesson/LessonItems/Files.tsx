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
    <div className="flex">
      <p>FILES TYPE:</p>
      <div>{content.title}</div>;
    </div>
  );
}
