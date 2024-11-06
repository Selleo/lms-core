import { Elements } from "@stripe/react-stripe-js";
import { type Appearance } from "@stripe/stripe-js";
import { useState } from "react";

import { useStripePaymentIntent } from "~/api/mutations/useStripePaymentIntent";
import { currentUserQueryOptions, useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { formatPrice } from "~/lib/formatters/priceFormatter";

import { useStripePromise } from "./hooks/useStripePromise";
import { PaymentForm } from "./PaymentForm";

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
  const [open, setOpen] = useState(false);
  const {
    data: { id: currentUserId },
  } = useCurrentUserSuspense();
  const stripePromise = useStripePromise();
  const { clientSecret, createPaymentIntent, resetClientSecret } = useStripePaymentIntent();

  const handlePayment = async () => {
    try {
      await createPaymentIntent({
        amount: coursePrice,
        currency: courseCurrency,
        customerId: currentUserId,
        courseId,
      });
      setOpen(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  const handlePaymentSuccess = () => {
    setOpen(false);
    resetClientSecret();
    toast({
      description: "Payment successful",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handlePayment}
          className="w-full bg-secondary-500 text-white py-2 rounded-lg"
        >
          Enroll - {formatPrice(coursePrice, courseCurrency)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="line-clamp-1 my-2">Enroll in {courseTitle}</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
