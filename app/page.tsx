"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { useAppStore } from "@/store";
import { getTotalSpent, formatCurrency } from "@/lib/utils";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { groups } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);

  const totalSpent    = groups.reduce((sum, g) => sum + getTotalSpent(g), 0);
  const totalGroups   = groups.length;
  const totalExpenses = groups.reduce((sum, g) => sum + g.expenses.length, 0);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 pb-24">

      {/* Header */}
      <div className="pt-10 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
            SplitSmart
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-foreground leading-tight">
          Split bills,<br />
          <span className="text-emerald-400">not friendships.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Track expenses & settle up with your group.
        </p>
      </div>

      {/* Stats — only show if there's data */}
      {groups.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="Total Spent" value={formatCurrency(totalSpent)} />
          <StatCard label="Groups"      value={String(totalGroups)}        />
          <StatCard label="Expenses"    value={String(totalExpenses)}      />
        </div>
      )}

      {/* Groups header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
          {groups.length > 0 ? "Your Groups" : "Get Started"}
        </span>
        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="h-8 gap-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          New Group
        </Button>
      </div>

      {/* Empty state */}
      {groups.length === 0 ? (
        <div className="mt-8">
          {/* Big empty card */}
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No groups yet
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Create a group for your trip, dinner, or any shared expense.
              Add members and start splitting instantly.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2"
            >
              <Plus className="w-4 h-4" />
              Create your first group
            </Button>
          </div>

          {/* Feature hints */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: "🧾", label: "Track expenses" },
              { icon: "⚖️", label: "Equal or custom splits" },
              { icon: "✅", label: "Settle up fast" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center"
              >
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      <CreateGroupModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold font-mono text-foreground truncate">
        {value}
      </p>
    </div>
  );
}