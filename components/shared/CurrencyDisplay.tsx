import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  amount: number;
  showSign?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
};

export function CurrencyDisplay({
  amount,
  showSign = false,
  size = "md",
  className,
}: Props) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const isZero = amount === 0;

  return (
    <span
      className={cn(
        "font-mono font-medium",
        sizes[size],
        isPositive && showSign && "text-emerald-400",
        isNegative && showSign && "text-red-400",
        isZero && showSign && "text-muted-foreground",
        className
      )}
    >
      {showSign && isPositive && "+"}
      {showSign && isNegative && "-"}
      {formatCurrency(amount)}
    </span>
  );
}