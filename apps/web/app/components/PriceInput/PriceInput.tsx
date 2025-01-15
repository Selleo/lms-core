import { Input } from "~/components/ui/input";

import type { ChangeEvent, InputHTMLAttributes } from "react";

type PriceInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  value?: number;
  onChange: (value: number) => void;
  currency?: string;
  max?: number;
};

/**
 * Input component for handling price entries with automatic formatting
 * @param {Object} props - Component props
 * @param {number} [props.value] - Value in cents (e.g., 1000 for 10.00)
 * @param {(value: number) => void} props.onChange - Callback triggered on value change, returns value in cents
 * @param {string} [props.currency] - Currency symbol displayed on the right side of input
 * @param {number} [props.max=999999.99] - Maximum allowed value in units (not cents)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * <PriceInput
 *   value={1000} // 10.00
 *   onChange={(value) => console.log(value)} // value will be in cents
 *   currency="PLN"
 * />
 */
export const PriceInput = ({
  value,
  onChange,
  currency,
  max = 999999.99,
  className,
  ...props
}: PriceInputProps) => {
  /**
   * Formats the input text by normalizing decimal separators and cleaning input
   * @param {string} value - Raw input value
   * @returns {string} Normalized price string with proper decimal formatting
   *
   * @example
   * normalizePrice("1,000.23") // "1000.23"
   * normalizePrice("1.000,23") // "1000.23"
   * normalizePrice("1000.234") // "1000.23"
   */
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
