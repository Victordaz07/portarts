"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isIndexBuilding =
    error.message?.includes("index is currently building") ||
    error.message?.includes("index is being built");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="font-display text-3xl text-text-primary mb-2">
        {isIndexBuilding ? "Configuring database" : "Something went wrong"}
      </h1>
      <p className="text-text-secondary mb-8 max-w-md">
        {isIndexBuilding
          ? "Firestore indexes are being built. This usually takes 2-5 minutes. Reload the page in a moment."
          : error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>
          {isIndexBuilding ? "Retry" : "Retry"}
        </Button>
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
