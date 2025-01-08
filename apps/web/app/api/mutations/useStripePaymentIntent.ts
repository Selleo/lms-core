import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { useTranslation } from "react-i18next";

type StripeClientPaymentIntent = {
  amount: number;
  currency: string;
  customerId: string;
  courseId: string;
};

type StripePaymentIntentResult = {
  clientSecret: string;
};

export function useStripePaymentIntent() {
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { t } = useTranslation();

  const mutation = useMutation<StripePaymentIntentResult, Error, StripeClientPaymentIntent>({
    mutationFn: async (options: StripeClientPaymentIntent) => {
      const response = await ApiClient.api.stripeControllerCreatePaymentIntent({
        amount: options.amount,
        currency: options.currency,
        customerId: options.customerId,
        courseId: options.courseId,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          description: error.response?.data.message || t('paymentView.toast.failed'),
        });
      } else {
        toast({
          variant: "destructive",
          description: error.message || t('paymentView.toast.somethingWentWrong'),
        });
      }
    },
  });

  const createPaymentIntent = useCallback(
    async (options: StripeClientPaymentIntent) => {
      setClientSecret(null);
      await mutation.mutateAsync(options);
    },
    [mutation],
  );

  const resetClientSecret = useCallback(() => {
    setClientSecret(null);
  }, []);

  return {
    clientSecret,
    createPaymentIntent,
    resetClientSecret,
    error: mutation.error,
  };
}
