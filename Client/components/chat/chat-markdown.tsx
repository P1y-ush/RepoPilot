"use client";

import { cn } from "@/lib/utils";

export function ChatMarkdown({
  content,
  isStreaming = false,
  className,
}: {
  content: string;
  isStreaming?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "chat-markdown whitespace-pre-wrap max-w-none text-sm leading-relaxed",
        isStreaming && "opacity-90",
        className
      )}
    >
      {content}
    </div>
  );
}
