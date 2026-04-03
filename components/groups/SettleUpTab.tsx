"use client";

import type { Group } from "@/types";
import { calculateSettlements, getMemberColorIndex, formatCurrency } from "@/lib/utils";
import { MemberAvatar } from "@/components/shared";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Props { group: Group }

export function SettleUpTab({ group }: Props) {
  const settlements = calculateSettlements(group);

  if (settlements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
        <h3 className="font-semibold text-foreground mb-1">All settled up!</h3>
        <p className="text-sm text-muted-foreground">
          No outstanding balances in this group.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Optimized — {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} needed
      </p>

      {settlements.map((s, i) => {
        const from   = group.members.find((m) => m.id === s.from);
        const to     = group.members.find((m) => m.id === s.to);
        const fromIdx = getMemberColorIndex(group, s.from);
        const toIdx   = getMemberColorIndex(group, s.to);
        if (!from || !to) return null;

        return (
          <div key={i}
            className="rounded-xl border border-border bg-card p-4">
            {/* Amount */}
            <div className="text-center mb-4">
              <span className="font-mono text-2xl font-semibold text-amber-400">
                {formatCurrency(s.amount)}
              </span>
            </div>

            {/* From → To */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col items-center gap-2 flex-1">
                <MemberAvatar name={from.name} index={fromIdx} size="lg" />
                <p className="text-sm font-medium text-foreground">{from.name}</p>
                <p className="text-xs text-muted-foreground">pays</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <MemberAvatar name={to.name} index={toIdx} size="lg" />
                <p className="text-sm font-medium text-foreground">{to.name}</p>
                <p className="text-xs text-muted-foreground">receives</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}