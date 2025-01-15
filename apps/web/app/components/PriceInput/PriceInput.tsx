import { Input } from "~/components/ui/input";

import type { ChangeEvent, InputHTMLAttributes } from "react";

type PriceInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: number;
  onChange: (value: number) => void;
  currency?: string;
  max?: number;
};

export const PriceInput = ({
  value,
  onChange,
  currency,
  max = 999999.99,
  className,
  ...props
}: PriceInputProps) => {
  const normalizePrice = (value: string) => {
    const normalized = value.replace(/[.,]/g, (match, index, string) => {
      return index === string.lastIndexOf(match) ? "." : "";
    });

    const cleaned = normalized.replace(/[^\d.]/g, "");
    const [whole, decimal] = cleaned.split(".");

    if (!decimal) return cleaned;
    return `${whole}.${decimal.slice(0, 2)}`;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const normalizedValue = normalizePrice(event.target.value);
    const numericValue = parseFloat(normalizedValue);

    if (numericValue > max) {
      event.target.value = max.toFixed(2);
      onChange(max * 100);
      return;
    }

    event.target.value = normalizedValue;

    if (!normalizedValue) {
      onChange(0);
      return;
    }

    const priceInCents = Math.round(parseFloat(normalizedValue) * 100);
    if (!isNaN(priceInCents) && priceInCents >= 0) {
      onChange(priceInCents);
    }
  };

  const formatPrice = (cents?: number): string => {
    if (!cents) return "";
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        onChange={handleChange}
        defaultValue={formatPrice(value)}
        className={className}
        {...props}
      />
      {currency && (
        <span className="absolute right-0 top-1/2 -translate-x-4 -translate-y-1/2 cursor-default uppercase">
          {currency}
        </span>
      )}
    </div>
  );
};
