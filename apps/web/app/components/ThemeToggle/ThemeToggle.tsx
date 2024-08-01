import { useThemeStore } from "~/modules/Theme/themeStore";
import { Button, ButtonProps } from "../ui/button";
import { match } from "ts-pattern";
import { LucideProps, Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  variant?: ButtonProps["variant"];
  className?: string;
};

export default function ThemeToggle({
  className,
  variant = "ghost",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  const ToggleIcon: React.FC<LucideProps> = (props) =>
    match(theme)
      .with("light", () => <Sun {...props} />)
      .with("dark", () => <Moon {...props} />)
      .exhaustive();

  return (
    <Button variant={variant} className={className} onClick={toggleTheme}>
      <ToggleIcon className="w-5 h-5" />
    </Button>
  );
}
