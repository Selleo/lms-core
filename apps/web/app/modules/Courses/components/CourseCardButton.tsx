import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { formatPrice } from "~/lib/formatters/priceFormatter";

type CourseCardButtonProps = {
  currency: string;
  enrolled: boolean;
  isAdmin: boolean;
  priceInCents: number;
  isScormCreatePage?: boolean;
};

const CourseCardButton = ({
  currency,
  enrolled,
  isAdmin,
  priceInCents,
  isScormCreatePage,
}: CourseCardButtonProps) => {
  const getButtonLabel = (enrolled: boolean, isAdmin: boolean) => {
    const { t } = useTranslation();
    if (enrolled) {
      return (
        <span className="flex gap-x-2 items-center">
          <Icon name="ArrowRight" className="w-4 h-4 text-white" />{" "}
          {t("clientStatisticsView.button.continue")}
        </span>
      );
    }

    if (isScormCreatePage) return t("clientStatisticsView.button.readMore");

    if (isAdmin) return t("clientStatisticsView.button.view");

    if (priceInCents)
      return `${t("clientStatisticsView.button.enroll")} - ${formatPrice(priceInCents, currency)}`;

    return t("clientStatisticsView.button.enroll");
  };

  const buttonLabel = getButtonLabel(enrolled, isAdmin);

  return (
    <Button variant={enrolled ? "secondary" : "primary"} className="mt-auto w-full">
      {buttonLabel}
    </Button>
  );
};

export default CourseCardButton;
