import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 flex flex-col items-center justify-center text-center">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Page not found
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        This page doesn&apos;t exist or was moved.
      </p>
      <Link href="/">
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">
          Go Home
        </Button>
      </Link>
    </main>
  );
}