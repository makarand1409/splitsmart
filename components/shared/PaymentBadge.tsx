import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

interface Props {
  method: PaymentMethod;
  className?: string;
}

const config: Record<PaymentMethod, { label: string; className: string }> = {
  upi:   { label: "UPI",   className: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  cash:  { label: "Cash",  className: "bg-amber-500/15  text-amber-400  border-amber-500/20"  },
  card:  { label: "Card",  className: "bg-blue-500/15   text-blue-400   border-blue-500/20"   },
  other: { label: "Other", className: "bg-zinc-500/15   text-zinc-400   border-zinc-500/20"   },
};

export function PaymentBadge({ method, className }: Props) {
  const { label, className: colorClass } = config[method];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}