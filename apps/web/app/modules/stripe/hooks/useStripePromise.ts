import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";

export const useStripePromise = () => {
  const stripePromise = useMemo(() => {
    try {
      return loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");
    } catch {
      return Promise.resolve(null);
    }
  }, []);

  return stripePromise;
};
