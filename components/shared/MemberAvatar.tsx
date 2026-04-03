import { getInitials, getAvatarColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  index: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export function MemberAvatar({ name, index, size = "md", className }: Props) {
  const color = getAvatarColor(index);
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold shrink-0",
        sizes[size],
        color.bg,
        color.text,
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}