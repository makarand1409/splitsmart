import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Group,
  Member,
  Expense,
  SplitDetail,
  SplitType,
  PaymentMethod,
} from "@/types";

interface CreateExpenseInput {
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  splitType: SplitType;
  splits: SplitDetail[];
  paymentMethod?: PaymentMethod;
  date: string;
  note?: string;
}

interface AppState {
  groups: Group[];
  createGroup:   (name: string, emoji: string, memberNames: string[]) => Group;
  deleteGroup:   (groupId: string) => void;
  updateGroup:   (groupId: string, updates: Partial<Pick<Group, "name" | "emoji">>) => void;
  addMember:     (groupId: string, name: string) => void;
  removeMember:  (groupId: string, memberId: string) => void;
  addExpense:    (input: CreateExpenseInput) => void;
  deleteExpense: (groupId: string, expenseId: string) => void;
  clearAll:      () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      groups: [],

      createGroup: (name, emoji, memberNames) => {
        const group: Group = {
          id:        uuidv4(),
          name,
          emoji,
          members:   memberNames
            .filter((n) => n.trim())
            .map((n) => ({ id: uuidv4(), name: n.trim() })),
          expenses:  [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ groups: [group, ...s.groups] }));
        return group;
      },

      deleteGroup: (groupId) =>
        set((s) => ({
          groups: s.groups.filter((g) => g.id !== groupId),
        })),

      updateGroup: (groupId, updates) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId ? { ...g, ...updates } : g
          ),
        })),

      addMember: (groupId, name) => {
        const member: Member = { id: uuidv4(), name: name.trim() };
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? { ...g, members: [...g.members, member] }
              : g
          ),
        }));
      },

      removeMember: (groupId, memberId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
              : g
          ),
        })),

      addExpense: (input) => {
        const expense: Expense = {
          ...input,
          id:        uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === input.groupId
              ? { ...g, expenses: [expense, ...g.expenses] }
              : g
          ),
        }));
      },

      deleteExpense: (groupId, expenseId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId
              ? { ...g, expenses: g.expenses.filter((e) => e.id !== expenseId) }
              : g
          ),
        })),

      clearAll: () => set({ groups: [] }),
    }),
    {
      name:    "splitsmart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);