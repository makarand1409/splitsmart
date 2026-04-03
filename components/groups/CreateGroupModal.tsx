"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMOJIS = ["🏖️","🍽️","✈️","🏕️","🎉","🏠","🎮","🚗","🛒","💼","🎂","🏋️","🎵","🏔️","🌴"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ open, onClose }: Props) {
  const router = useRouter();
  const { createGroup } = useAppStore();

  const [name,        setName]        = useState("");
  const [emoji,       setEmoji]       = useState("🏖️");
  const [members,     setMembers]     = useState(["", ""]);
  const [customEmoji, setCustomEmoji] = useState("");

  function addMemberField() {
    setMembers((prev) => [...prev, ""]);
  }

  function updateMember(index: number, value: string) {
    setMembers((prev) => prev.map((m, i) => (i === index ? value : m)));
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    const validMembers = members.filter((m) => m.trim());
    if (validMembers.length < 2) {
      toast.error("Add at least 2 members");
      return;
    }

    const group = createGroup(name.trim(), customEmoji || emoji, validMembers);
    toast.success(`"${name}" created!`);
    handleClose();
    router.push(`/groups/${group.id}`);
  }

  function handleClose() {
    setName("");
    setEmoji("🏖️");
    setMembers(["", ""]);
    setCustomEmoji("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Group Name */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Group Name
            </Label>
            <Input
              placeholder="e.g. Goa Trip, Dinner Night..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Emoji Picker */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Pick an Emoji
            </Label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => { setEmoji(e); setCustomEmoji(""); }}
                  className={`w-9 h-9 rounded-lg text-lg transition-all ${
                    emoji === e && !customEmoji
                      ? "bg-emerald-500/20 ring-1 ring-emerald-500"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <Input
              placeholder="Or type any emoji..."
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500 mt-2"
              maxLength={2}
            />
          </div>

          {/* Members */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
              Members
            </Label>
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Member ${index + 1} name`}
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                  />
                  {members.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(index)}
                      className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={addMemberField}
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 mt-1 w-full"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Member
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex-1 border border-zinc-700 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
            >
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}