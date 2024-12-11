import { useForm } from "react-hook-form";

export const Pricing = () => {
  const form = useForm();
  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return <input className={"h-5 w-5 border-2 focus:ring-transparent "} type="radio" />;
};
