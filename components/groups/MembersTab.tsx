"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Group } from "@/types";
import { getMemberColorIndex } from "@/lib/utils";
import { useAppStore } from "@/store";
import { MemberAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props { group: Group }

export function MembersTab({ group }: Props) {
  const { addMember, removeMember } = useAppStore();
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    addMember(group.id, newName.trim());
    toast.success(`${newName.trim()} added!`);
    setNewName("");
  }

  function handleRemove(memberId: string, name: string) {
    removeMember(group.id, memberId);
    toast.success(`${name} removed`);
  }

  return (
    <div className="space-y-4">
      {/* Add member input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add new member..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="bg-zinc-800 border-zinc-700 text-foreground placeholder:text-zinc-600 focus-visible:ring-emerald-500"
        />
        <Button
          onClick={handleAdd}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Members list */}
      <div className="space-y-2">
        {group.members.map((member) => {
          const idx = getMemberColorIndex(group, member.id);
          return (
            <div key={member.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <MemberAvatar name={member.name} index={idx} size="md" />
              <p className="flex-1 font-medium text-foreground text-sm">
                {member.name}
              </p>
              <button
                onClick={() => handleRemove(member.id, member.name)}
                className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}