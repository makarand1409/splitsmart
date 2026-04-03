"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { getTotalSpent, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { BalancesTab } from "@/components/groups/BalancesTab";
import { SettleUpTab } from "@/components/groups/SettleUpTab";
import { MembersTab } from "@/components/groups/MembersTab";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { EmptyState } from "@/components/shared";

export default function GroupPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const { groups, deleteGroup } = useAppStore();
  const [showAddExpense, setShowAddExpense] = useState(false);

  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <main className="min-h-screen max-w-lg mx-auto px-4">
        <EmptyState
          icon="🔍"
          title="Group not found"
          description="This group doesn't exist or was deleted."
          action={
            <Button
              onClick={() => router.push("/")}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
            >
              Go Home
            </Button>
          }
        />
      </main>
    );
  }

  function handleDeleteGroup() {
    if (!confirm(`Delete "${group!.name}"? This cannot be undone.`)) return;
    deleteGroup(group!.id);
    toast.success(`"${group!.name}" deleted`);
    router.push("/");
  }

  const totalSpent = getTotalSpent(group);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pb-24">
      {/* Header */}
      <div className="pt-6 pb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl shrink-0">
              {group.emoji}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {group.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {group.members.length} members &middot; {formatCurrency(totalSpent)} spent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setShowAddExpense(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-9 gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800"
              >
                <DropdownMenuItem
                  onClick={handleDeleteGroup}
                  className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10 cursor-pointer gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="w-full bg-zinc-900 border border-zinc-800 p-1 h-auto mb-6">
          <TabsTrigger
            value="expenses"
            className="flex-1 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-foreground text-muted-foreground"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="balances"
            className="flex-1 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-foreground text-muted-foreground"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="settle"
            className="flex-1 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-foreground text-muted-foreground"
          >
            Settle Up
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="flex-1 text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-foreground text-muted-foreground"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <ExpensesList
            group={group}
            onAddExpense={() => setShowAddExpense(true)}
          />
        </TabsContent>

        <TabsContent value="balances">
          <BalancesTab group={group} />
        </TabsContent>

        <TabsContent value="settle">
          <SettleUpTab group={group} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab group={group} />
        </TabsContent>
      </Tabs>

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        group={group}
      />
    </main>
  );
}