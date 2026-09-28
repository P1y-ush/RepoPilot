"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type IndexStatus, type IndexStatusResponse, type Repository } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useRepos(refresh = false) {
  return useQuery({
    queryKey: queryKeys.repos.all,
    queryFn: () => api.listRepos(refresh),
    staleTime: 60 * 1000,
  });
}

export function useRefreshRepos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.listRepos(true),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.repos.all, data);
    },
  });
}

export function useRepository(id: string) {
  return useQuery({
    queryKey: queryKeys.repos.detail(id),
    queryFn: () => api.getRepo(id),
    enabled: Boolean(id),
  });
}

export function useStartIndexing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.startIndex(id),
    onSuccess: (updatedRepo) => {
      queryClient.setQueryData(
        queryKeys.repos.all,
        (old: Repository[] | undefined) =>
          old?.map((r) => (r.id === updatedRepo.id ? updatedRepo : r)) ?? [
            updatedRepo,
          ]
      );
      queryClient.setQueryData(
        queryKeys.repos.detail(updatedRepo.id),
        updatedRepo
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.repos.status(updatedRepo.id),
      });
    },
  });
}

export function useIndexStatus(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.repos.status(id),
    queryFn: () => api.indexStatus(id),
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.indexStatus;
      if (status === "PENDING" || status === "INDEXING") {
        return 2000;
      }
      return false;
    },
  });
}

export function getRepoProgress(
  repo: { filesProcessed: number; filesTotal: number; indexStatus?: IndexStatus }
): number {
  if (repo.indexStatus === "READY") return 100;
  if (!repo.filesTotal || repo.filesTotal === 0) return 0;
  return Math.min(
    100,
    Math.round((repo.filesProcessed / repo.filesTotal) * 100)
  );
}
