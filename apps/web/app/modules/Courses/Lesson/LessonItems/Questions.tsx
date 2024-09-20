type TProps = {
  content: {
    id: string;
    questionType: string;
    questionBody: string;
    questionAnswers: {
      id: string;
      optionText: string;
      position: number | null;
    }[];
  };
};

export default function Questions({ content }: TProps) {
  return (
    <div className="flex">
      <p>QUESTION TYPE:</p>
      <div>{content.questionBody}</div>
    </div>
  );
}
