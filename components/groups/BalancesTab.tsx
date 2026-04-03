"use client";

import type { Group } from "@/types";
import { calculateBalances, getMemberColorIndex, formatCurrency } from "@/lib/utils";
import { MemberAvatar } from "@/components/shared";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props { group: Group }

export function BalancesTab({ group }: Props) {
  const balances = calculateBalances(group);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Net balance per member
      </p>

      {balances.map((b) => {
        const member = group.members.find((m) => m.id === b.memberId);
        if (!member) return null;
        const idx = getMemberColorIndex(group, b.memberId);

        const isPos  = b.amount >  0.5;
        const isNeg  = b.amount < -0.5;
        const isZero = !isPos && !isNeg;

        return (
          <div key={b.memberId}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <MemberAvatar name={member.name} index={idx} size="md" />

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{member.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPos  ? "gets back"  :
                 isNeg  ? "owes"       :
                 "is settled up"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isPos  && <TrendingUp  className="w-4 h-4 text-emerald-400" />}
              {isNeg  && <TrendingDown className="w-4 h-4 text-red-400"    />}
              {isZero && <Minus        className="w-4 h-4 text-zinc-600"   />}

              <span className={cn(
                "font-mono font-semibold text-sm",
                isPos  && "text-emerald-400",
                isNeg  && "text-red-400",
                isZero && "text-muted-foreground"
              )}>
                {isZero ? "±₹0" :
                 isPos  ? `+${formatCurrency(b.amount)}` :
                          `-${formatCurrency(b.amount)}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}