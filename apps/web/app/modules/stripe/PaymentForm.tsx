import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useEnrollCourse } from "~/api/mutations/useEnrollCourse";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { formatPrice } from "~/lib/formatters/priceFormatter";

type PaymentForm = {
  courseId: string;
  price: number;
  currency: string;
  onPaymentSuccess: () => void;
};

export const PaymentForm = ({
  courseId,
  price,
  currency,
  onPaymentSuccess,
}: PaymentForm) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const { mutateAsync: enrollCourse } = useEnrollCourse();

  const handleEnroll = () => {
    enrollCourse({ id: courseId }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
      setProcessing(false);
      onPaymentSuccess();
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      console.log("Payment succeeded");
      handleEnroll();
    } else {
      console.log("Payment status:", result.paymentIntent?.status);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button
        disabled={!stripe || processing}
        className="w-full bg-secondary-500 text-white py-2 rounded-lg"
      >
        {processing ? (
          <Loader className="animate-spin" />
        ) : (
          `Buy for ${formatPrice(price, currency)}`
        )}
      </Button>
      {error && (
        <div className="border border-destructive rounded-sm text-destructive px-2 py-1 text-sm">
          {error}
        </div>
      )}
    </form>
  );
};
