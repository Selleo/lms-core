import { Elements } from "@stripe/react-stripe-js";

import { useStripePaymentIntent } from "~/api/mutations/useStripePaymentIntent";
import { currentUserQueryOptions } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { formatPrice } from "~/lib/formatters/priceFormatter";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";

import { useStripePromise } from "./hooks/useStripePromise";
import { PaymentForm } from "./PaymentForm";

import type { Appearance } from "@stripe/stripe-js";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(currentUserQueryOptions);
  return null;
};

type PaymentModalProps = {
  coursePrice: number;
  courseCurrency: string;
  courseTitle: string;
  courseId: string;
};

const appearance: Appearance = {
  theme: "stripe",
  variables: {},
  rules: {},
};

export function PaymentModal({
  coursePrice,
  courseCurrency,
  courseTitle,
  courseId,
}: PaymentModalProps) {
  const { currentUser } = useCurrentUserStore();
  const stripePromise = useStripePromise();
  const { clientSecret, createPaymentIntent, resetClientSecret } = useStripePaymentIntent();

  const handlePayment = async () => {
    try {
      await createPaymentIntent({
        amount: coursePrice,
        currency: courseCurrency,
        customerId: currentUser?.id ?? "",
        courseId,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  const handlePaymentSuccess = async () => {
    resetClientSecret();
    toast({
      description: "Payment successful",
    });
  };

  return (
    <>
      <Button onClick={handlePayment} className="gap-x-2" variant="primary">
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 14V11M18 13V10M12.5 13.91C13.6046 13.91 14.5 13.0146 14.5 11.91C14.5 10.8055 13.6046 9.91002 12.5 9.91002C11.3954 9.91002 10.5 10.8055 10.5 11.91C10.5 13.0146 11.3954 13.91 12.5 13.91ZM20.304 18.213C17.799 17.712 15.215 17.774 12.737 18.393L12.5 18.453C9.866 19.111 7.119 19.177 4.457 18.644L4.304 18.613C3.836 18.52 3.5 18.109 3.5 17.633V6.79402C3.5 6.16302 4.077 5.69002 4.696 5.81302C7.201 6.31402 9.785 6.25202 12.263 5.63302L12.736 5.51502C15.214 4.89602 17.799 4.83402 20.303 5.33502L20.695 5.41302C21.164 5.50702 21.5 5.91702 21.5 6.39402V17.233C21.5 17.864 20.923 18.337 20.304 18.213Z"
            stroke="#FCFCFC"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span> Enroll to the course - {formatPrice(coursePrice, courseCurrency)}</span>
      </Button>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <PaymentForm
            currency={courseCurrency}
            courseId={courseId}
            price={coursePrice}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
    </>
  );
}
