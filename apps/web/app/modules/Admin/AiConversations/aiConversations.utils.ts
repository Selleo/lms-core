import type { SupportedLanguages } from "@repo/shared";
import type { AdminAiThreadsParams } from "~/api/queries/admin/useAdminAiThreads";

export const AI_CONVERSATIONS_PATH = "/admin/ai-conversations";

export function dateBoundary(value: string | null, end = false) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day)
    return undefined;
  if (end) date.setDate(date.getDate() + 1);
  return date.toISOString();
}

export function readConversationFilters(params: URLSearchParams, language: SupportedLanguages) {
  const rawPage = Number(params.get("page"));
  const rawPerPage = Number(params.get("perPage"));
  const perPage = ([10, 20, 50, 100] as const).find((size) => size === rawPerPage) ?? 20;
  const type = params.get("type");
  const status = params.get("status");
  return {
    page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    perPage,
    language,
    search: params.get("search") || undefined,
    type: type === "practice" || type === "ai-mentor" ? type : undefined,
    status:
      status === "active" || status === "completed" || status === "archived" ? status : undefined,
    from: dateBoundary(params.get("from")),
    to: dateBoundary(params.get("to"), true),
  } satisfies AdminAiThreadsParams;
}

export function updateConversationFilters(params: URLSearchParams, key: string, value: string) {
  const next = cleanConversationSearchParams(params);
  if (value) next.set(key, value);
  else next.delete(key);
  if (key !== "page") next.delete("page");
  return `${AI_CONVERSATIONS_PATH}?${next.toString()}`;
}

export function cleanConversationSearchParams(params: URLSearchParams) {
  const next = new URLSearchParams(params);
  next.delete("userId");
  next.delete("ownerName");
  return next;
}
