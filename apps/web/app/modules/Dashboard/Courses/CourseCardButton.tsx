import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { formatPrice } from "~/lib/formatters/priceFormatter";

type CourseCardButtonProps = {
  currency: string;
  enrolled: boolean;
  isAdmin: boolean;
  priceInCents: number;
};

const CourseCardButton = ({
  currency,
  enrolled,
  isAdmin,
  priceInCents,
}: CourseCardButtonProps) => {
  const getButtonLabel = (enrolled: boolean, isAdmin: boolean) => {
    if (enrolled) {
      return (
        <span className="flex gap-x-2 items-center">
          <Icon name="ArrowRight" className="w-4 h-4 text-white" /> Continue
        </span>
      );
    }

    if (isAdmin) return "View";

    if (priceInCents) return `Enroll - ${formatPrice(priceInCents, currency)}`;

    return "Enroll";
  };

  const buttonLabel = getButtonLabel(enrolled, isAdmin);

  return (
    <Button
      variant={enrolled ? "secondary" : "primary"}
      className="mt-auto w-full"
    >
      {buttonLabel}
    </Button>
  );
};

export default CourseCardButton;
