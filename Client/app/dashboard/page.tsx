"use client";

import { RequireAuth } from "@/components/providers/require-auth";
import { AppShell } from "@/components/layout/app-shell";
import { RepoDashboard } from "@/components/dashboard/repo-dashboard";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell
        title="Repositories"
        description="Select a repository to index or start chatting"
      >
        <RepoDashboard />
      </AppShell>
    </RequireAuth>
  );
}
