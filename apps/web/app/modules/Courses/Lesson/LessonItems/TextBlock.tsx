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
    <div className="flex">
      <p>TEXT BLOCK TYPE:</p>
      <div>{content.title}</div>
    </div>
  );
}
