"use client";

import { useRouter } from "next/navigation";
import { Users, Receipt } from "lucide-react";
import type { Group } from "@/types";
import { calculateBalances, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  group: Group;
}

export function GroupCard({ group }: Props) {
  const router = useRouter();

  // Use first member as "you" for balance display
  const balances  = calculateBalances(group);
  const myBalance = balances[0]?.amount ?? 0;

  const balanceLabel =
    myBalance > 0.5  ? `you are owed ${formatCurrency(myBalance)}`  :
    myBalance < -0.5 ? `you owe ${formatCurrency(myBalance)}`        :
    "all settled up";

  const balanceColor =
    myBalance > 0.5  ? "text-emerald-400" :
    myBalance < -0.5 ? "text-red-400"     :
    "text-muted-foreground";

  return (
    <button
      onClick={() => router.push(`/groups/${group.id}`)}
      className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-150 group"
    >
      <div className="flex items-center gap-3">
        {/* Emoji icon */}
        <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shrink-0 group-hover:bg-zinc-700 transition-colors">
          {group.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{group.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {group.members.length}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Receipt className="w-3 h-3" />
              {group.expenses.length}
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right shrink-0">
          <p className={cn("text-sm font-medium font-mono", balanceColor)}>
            {myBalance > 0.5  ? `+${formatCurrency(myBalance)}`  :
             myBalance < -0.5 ? `-${formatCurrency(myBalance)}`  :
             "settled"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{balanceLabel}</p>
        </div>
      </div>
    </button>
  );
}