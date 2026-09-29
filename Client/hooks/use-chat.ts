"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getApiBaseUrl, type ChatSession, type ChatMessage } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useChatSessions(repositoryId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chat.sessions(repositoryId),
    queryFn: () => api.listSessions(repositoryId),
    enabled: Boolean(repositoryId) && enabled,
  });
}

export function useCreateChatSession(repositoryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => api.createSession(repositoryId, title),
    onSuccess: (newSession: ChatSession) => {
      queryClient.setQueryData(
        queryKeys.chat.sessions(repositoryId),
        (old: ChatSession[] | undefined) =>
          old ? [newSession, ...old] : [newSession]
      );
    },
  });
}

export function useChatMessages(sessionId: string | null) {
  return useQuery({
    queryKey: queryKeys.chat.messages(sessionId ?? ""),
    queryFn: () => (sessionId ? api.getMessages(sessionId) : Promise.resolve([])),
    enabled: Boolean(sessionId),
  });
}

export function useStreamChat(sessionId: string | null) {
  const queryClient = useQueryClient();
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreaming(false);
  }, []);

  const send = useCallback(
    async (prompt: string) => {
      if (!sessionId || !prompt.trim() || streaming) return;

      const userMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "USER",
        content: prompt,
        citations: [],
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        queryKeys.chat.messages(sessionId),
        (old: ChatMessage[] | undefined) => (old ? [...old, userMsg] : [userMsg])
      );

      setStreaming(true);
      setStreamText("");
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/chat/sessions/${sessionId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content: prompt }),
            signal: controller.signal,
          }
        );

        if (!response.ok || !response.body) {
          const errorMsg = await response.text().catch(() => "Failed to send message");
          throw new Error(errorMsg || "Failed to send message");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const block of parts) {
            const lines = block.split("\n");
            let eventType = "";
            let dataStr = "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataStr = line.slice(5).trim();
              }
            }

            if (eventType === "token" && dataStr) {
              try {
                const token = JSON.parse(dataStr);
                setStreamText((prev) => prev + token);
              } catch {
                setStreamText((prev) => prev + dataStr);
              }
            } else if (eventType === "error" && dataStr) {
              setStreamText((prev) => prev + "\n\n⚠️ **Error:** " + dataStr);
              break;
            } else if (eventType === "done") {
              break;
            }
          }
        }

        await queryClient.invalidateQueries({
          queryKey: queryKeys.chat.messages(sessionId),
        });
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Stream chat error:", err);
        }
      } finally {
        setStreaming(false);
        setStreamText("");
        abortControllerRef.current = null;
      }
    },
    [sessionId, streaming, queryClient]
  );

  return { send, stop, streaming, streamText };
}
