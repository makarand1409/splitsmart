"use client";

import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Group, Expense } from "@/types";
import {
  formatCurrency,
  formatDate,
  getMemberColorIndex,
} from "@/lib/utils";
import { useAppStore } from "@/store";
import { MemberAvatar, EmptyState, PaymentBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";

interface Props {
  group: Group;
  onAddExpense: () => void;
}

export function ExpensesList({ group, onAddExpense }: Props) {
  const { deleteExpense } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (group.expenses.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="No expenses yet"
        description="Add your first expense to start tracking."
        action={
          <Button
            onClick={onAddExpense}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        }
      />
    );
  }

  function handleDelete(expense: Expense) {
    deleteExpense(group.id, expense.id);
    toast.success("Expense deleted");
  }

  return (
    <div className="space-y-3">
      {group.expenses.map((expense) => {
        const paidBy   = group.members.find((m) => m.id === expense.paidById);
        const paidByIdx = getMemberColorIndex(group, expense.paidById);
        const isExpanded = expandedId === expense.id;

        return (
          <div
            key={expense.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Main Row */}
            <button
              className="w-full text-left p-4 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : expense.id)}
            >
              {/* Paid by avatar */}
              {paidBy && (
                <MemberAvatar name={paidBy.name} index={paidByIdx} size="md" />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {expense.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    {paidBy?.name} paid
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                  {expense.paymentMethod && (
                    <>
                      <span className="text-xs text-muted-foreground">·</span>
                      <PaymentBadge method={expense.paymentMethod} />
                    </>
                  )}
                </div>
              </div>

              {/* Amount + expand */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono font-semibold text-foreground text-sm">
                  {formatCurrency(expense.amount)}
                </span>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                }
              </div>
            </button>

            {/* Expanded: split breakdown */}
            {isExpanded && (
              <div className="border-t border-border bg-zinc-900/50 p-4 space-y-3">
                {/* Split details */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Split breakdown · {expense.splitType}
                  </p>
                  <div className="space-y-1.5">
                    {expense.splits.map((split) => {
                      const member = group.members.find((m) => m.id === split.memberId);
                      const idx    = getMemberColorIndex(group, split.memberId);
                      if (!member) return null;
                      return (
                        <div key={split.memberId}
                          className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MemberAvatar name={member.name} index={idx} size="sm" />
                            <span className="text-sm text-zinc-400">{member.name}</span>
                          </div>
                          <span className="font-mono text-sm text-foreground">
                            {formatCurrency(split.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Note */}
                {expense.note && (
                  <div className="rounded-lg bg-zinc-800 px-3 py-2">
                    <p className="text-xs text-muted-foreground">📝 {expense.note}</p>
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(expense)}
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete expense
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}