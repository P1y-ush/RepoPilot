"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard");
      } else if (isError) {
        router.replace("/login?error=auth_failed");
      }
    }
  }, [user, isLoading, isError, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background text-foreground">
      <Spinner className="size-8" />
      <p className="text-sm text-muted-foreground">Completing authentication...</p>
    </div>
  );
}
