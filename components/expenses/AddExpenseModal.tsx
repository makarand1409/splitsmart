"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Group, SplitType, PaymentMethod, SplitDetail } from "@/types";
import { useAppStore } from "@/store";
import { calculateEqualSplits, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberAvatar } from "@/components/shared";
import { getMemberColorIndex } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  group: Group;
}

export function AddExpenseModal({ open, onClose, group }: Props) {
  const { addExpense } = useAppStore();

  // Form state
  const [description,    setDescription]    = useState("");
  const [amount,         setAmount]         = useState("");
  const [paidById,       setPaidById]       = useState(group.members[0]?.id ?? "");
  const [paymentMethod,  setPaymentMethod]  = useState<PaymentMethod | "">("");
  const [splitType,      setSplitType]      = useState<SplitType>("equal");
  const [selectedIds,    setSelectedIds]    = useState<string[]>(group.members.map((m) => m.id));
  const [customAmounts,  setCustomAmounts]  = useState<Record<string, string>>({});
  const [date,           setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [note,           setNote]           = useState("");

  function resetForm() {
    setDescription("");
    setAmount("");
    setPaidById(group.members[0]?.id ?? "");
    setPaymentMethod("");
    setSplitType("equal");
    setSelectedIds(group.members.map((m) => m.id));
    setCustomAmounts({});
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
  }

  function closeAndReset() {
    onClose();
    // Defer reset to avoid updating local state in the same close transition tick.
    setTimeout(resetForm, 0);
  }

  // Toggle a member in/out of the split
  function toggleMember(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Custom amount helpers
  function setCustomAmount(memberId: string, value: string) {
    setCustomAmounts((prev) => ({ ...prev, [memberId]: value }));
  }

  const totalAmount    = parseFloat(amount) || 0;
  const customTotal    = selectedIds.reduce((sum, id) => sum + (parseFloat(customAmounts[id] || "0")), 0);
  const customRemainder = Math.round((totalAmount - customTotal) * 100) / 100;
  const isCustomValid  = Math.abs(customRemainder) < 0.5;

  function handleSubmit() {
    // Validation
    if (!description.trim()) { toast.error("Enter a description"); return; }
    if (!totalAmount || totalAmount <= 0) { toast.error("Enter a valid amount"); return; }
    if (selectedIds.length === 0) { toast.error("Select at least one member to split with"); return; }
    if (splitType === "custom" && !isCustomValid) {
      toast.error(`Amounts don't add up. Difference: ₹${Math.abs(customRemainder)}`);
      return;
    }

    // Build splits
    let splits: SplitDetail[] = [];

    if (splitType === "equal") {
      const equalMap = calculateEqualSplits(totalAmount, selectedIds);
      splits = selectedIds.map((id) => ({ memberId: id, amount: equalMap[id] }));
    } else {
      splits = selectedIds.map((id) => ({
        memberId: id,
        amount: parseFloat(customAmounts[id] || "0"),
      }));
    }

    addExpense({
      groupId:       group.id,
      description:   description.trim(),
      amount:        totalAmount,
      paidById,
      splitType,
      splits,
      paymentMethod: paymentMethod || undefined,
      date,
      note:          note.trim() || undefined,
    });

    toast.success("Expense added!");
    closeAndReset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (open && !nextOpen) closeAndReset();
      }}
    >
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Expense</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Description
            </Label>
            <Input
              placeholder="Dinner, cab, hotel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Amount + Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Amount (₹)
              </Label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Payment
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-foreground focus:ring-emerald-500">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="upi">💜 UPI</SelectItem>
                  <SelectItem value="cash">💵 Cash</SelectItem>
                  <SelectItem value="card">💳 Card</SelectItem>
                  <SelectItem value="other">🔖 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-foreground focus-visible:ring-emerald-500"
            />
          </div>

          {/* Paid By */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Paid By
            </Label>
            <Select value={paidById} onValueChange={setPaidById}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-foreground focus:ring-emerald-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {group.members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Between */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Split Between
            </Label>
            <div className="flex flex-wrap gap-2">
              {group.members.map((m) => {
                const idx      = getMemberColorIndex(group, m.id);
                const selected = selectedIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                      selected
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <MemberAvatar name={m.name} index={idx} size="sm" />
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Split Type Toggle */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Split Type
            </Label>
            <div className="flex gap-2">
              {(["equal", "custom"] as SplitType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSplitType(type)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                    splitType === type
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Equal Split Preview */}
          {splitType === "equal" && selectedIds.length > 0 && totalAmount > 0 && (
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-3">
              <p className="text-xs text-muted-foreground mb-2">Split preview</p>
              <div className="space-y-1.5">
                {selectedIds.map((id) => {
                  const member = group.members.find((m) => m.id === id);
                  if (!member) return null;
                  const equalMap = calculateEqualSplits(totalAmount, selectedIds);
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-zinc-400">{member.name}</span>
                      <span className="font-mono text-foreground">
                        {formatCurrency(equalMap[id] ?? 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Split Inputs */}
          {splitType === "custom" && (
            <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-3 space-y-2">
              <p className="text-xs text-muted-foreground mb-1">Enter each person&apos;s share</p>
              {selectedIds.map((id) => {
                const member = group.members.find((m) => m.id === id);
                if (!member) return null;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400 w-20 truncate">{member.name}</span>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={customAmounts[id] || ""}
                      onChange={(e) => setCustomAmount(id, e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-foreground font-mono focus-visible:ring-emerald-500 h-8 text-sm"
                    />
                  </div>
                );
              })}

              {/* Running total */}
              <div className={cn(
                "flex justify-between text-sm pt-2 border-t border-zinc-700 font-mono",
                isCustomValid ? "text-emerald-400" : "text-red-400"
              )}>
                <span>Total</span>
                <span>
                  {formatCurrency(customTotal)} / {formatCurrency(totalAmount)}
                  {!isCustomValid && ` (${customRemainder > 0 ? "-" : "+"}₹${Math.abs(customRemainder)} remaining)`}
                </span>
              </div>
            </div>
          )}

          {/* Note (optional) */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Note (optional)
            </Label>
            <Input
              placeholder="Any extra context..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={closeAndReset}
              className="flex-1 border border-zinc-700 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
            >
              Add Expense
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}