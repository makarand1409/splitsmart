import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Group, Balance, Settlement } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  { bg: "bg-blue-500/20",    text: "text-blue-400"    },
  { bg: "bg-pink-500/20",    text: "text-pink-400"    },
  { bg: "bg-amber-500/20",   text: "text-amber-400"   },
  { bg: "bg-purple-500/20",  text: "text-purple-400"  },
  { bg: "bg-teal-500/20",    text: "text-teal-400"    },
  { bg: "bg-orange-500/20",  text: "text-orange-400"  },
  { bg: "bg-cyan-500/20",    text: "text-cyan-400"    },
];

export function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getMemberColorIndex(group: Group, memberId: string) {
  return group.members.findIndex((m) => m.id === memberId);
}

// Core algorithm: net balance per member
// Positive = they are owed money
// Negative = they owe money
export function calculateBalances(group: Group): Balance[] {
  const map: Record<string, number> = {};
  group.members.forEach((m) => (map[m.id] = 0));

  group.expenses.forEach((expense) => {
    map[expense.paidById] += expense.amount;
    expense.splits.forEach((split) => {
      map[split.memberId] -= split.amount;
    });
  });

  return Object.entries(map).map(([memberId, amount]) => ({
    memberId,
    amount: Math.round(amount * 100) / 100,
  }));
}

// Optimized settlement: minimize number of transactions
export function calculateSettlements(group: Group): Settlement[] {
  const balances = calculateBalances(group);

  const creditors: { id: string; amount: number }[] = [];
  const debtors:   { id: string; amount: number }[] = [];

  balances.forEach((b) => {
    if (b.amount > 0.5)  creditors.push({ id: b.memberId, amount: b.amount });
    if (b.amount < -0.5) debtors.push({   id: b.memberId, amount: -b.amount });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i];
    const debt   = debtors[j];
    const amount = Math.min(credit.amount, debt.amount);

    if (amount > 0.5) {
      settlements.push({
        from:   debt.id,
        to:     credit.id,
        amount: Math.round(amount),
      });
    }

    credit.amount -= amount;
    debt.amount   -= amount;

    if (credit.amount < 0.5) i++;
    if (debt.amount   < 0.5) j++;
  }

  return settlements;
}

export function getTotalSpent(group: Group): number {
  return group.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function isGroupSettled(group: Group): boolean {
  return calculateSettlements(group).length === 0;
}

export function calculateEqualSplits(
  amount: number,
  memberIds: string[]
): Record<string, number> {
  if (memberIds.length === 0) return {};
  const perPerson = Math.floor((amount / memberIds.length) * 100) / 100;
  const remainder =
    Math.round((amount - perPerson * memberIds.length) * 100) / 100;

  const splits: Record<string, number> = {};
  memberIds.forEach((id, idx) => {
    splits[id] = idx === 0 ? perPerson + remainder : perPerson;
  });
  return splits;
}