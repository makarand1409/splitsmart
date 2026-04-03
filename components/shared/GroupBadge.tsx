import { cn } from "@/lib/utils";

interface Props {
  emoji: string;
  name: string;
  className?: string;
}

export function GroupBadge({ emoji, name, className }: Props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xl">{emoji}</span>
      <span className="font-semibold text-foreground">{name}</span>
    </div>
  );
}