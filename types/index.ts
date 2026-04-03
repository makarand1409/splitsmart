export type PaymentMethod = "upi" | "cash" | "card" | "other";
export type SplitType = "equal" | "custom";

export interface Member {
  id: string;
  name: string;
}

export interface SplitDetail {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  splitType: SplitType;
  splits: SplitDetail[];
  paymentMethod?: PaymentMethod;
  date: string;
  createdAt: string;
  note?: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export interface Balance {
  memberId: string;
  amount: number;
}