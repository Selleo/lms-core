type TextBlankProps = {
  index: number;
  studentAnswer?: string;
  handleOnBlur: (value: string, index: number) => void;
};

export const TextBlank = ({
  index,
  studentAnswer,
  handleOnBlur,
}: TextBlankProps) => {
  return (
    <input
      key={index}
      defaultValue={studentAnswer}
      onBlur={(e) => {
        const value = e.target.value;

        handleOnBlur(value, index);
      }}
      type="text"
      className="bg-transparent border-dashed border-b mx-1.5 w-20 border-b-black focus:ring-0 focus:outline-none"
    />
  );
};
