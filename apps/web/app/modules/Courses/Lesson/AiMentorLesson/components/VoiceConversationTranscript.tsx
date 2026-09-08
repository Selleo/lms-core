import { LEARNER_TRANSCRIPT_STATUSES } from "@repo/shared";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentUserSuspense } from "~/api/queries";
import { Icon } from "~/components/Icon";
import { UserAvatar } from "~/components/UserProfile/UserAvatar";
import { cn } from "~/lib/utils";

import type {
  LearnerTranscriptRevision,
  MentorSpeechPresentation,
} from "~/modules/Voice/voice-mentor-presentation.types";

type VoiceConversationTranscriptProps = {
  learnerTranscript: LearnerTranscriptRevision | null;
  mentorResponse: string;
  mentorSpeech: MentorSpeechPresentation | null;
  mentorName: string;
  mentorAvatarUrl?: string | null;
};

function getDisplaySegments(text: string, words: MentorSpeechPresentation["words"]) {
  const segments: Array<{ text: string; wordIndex: number | null; offset: number }> = [];
  let cursor = 0;
  for (const [wordIndex, word] of words.entries()) {
    if (!word.text) continue;
    const start = text.indexOf(word.text, cursor);
    if (start < 0) break;
    const end = start + word.text.length;
    // Never highlight a coincidental substring of a word or decimal expression.
    const before = text.slice(Math.max(0, start - 2), start);
    const after = text.slice(end, end + 2);
    if (
      (/^[\p{L}\p{N}_]/u.test(word.text) && /[\p{L}\p{N}_]$|\d[.,]$/u.test(before)) ||
      (/[\p{L}\p{N}_]$/u.test(word.text) && /^[\p{L}\p{N}_]|^[.,]\d/u.test(after))
    )
      break;
    if (start > cursor)
      segments.push({ text: text.slice(cursor, start), wordIndex: null, offset: cursor });
    segments.push({ text: text.slice(start, end), wordIndex, offset: start });
    cursor = end;
  }
  if (cursor < text.length)
    segments.push({ text: text.slice(cursor), wordIndex: null, offset: cursor });
  return segments;
}

function MentorAvatar({
  mentorName,
  mentorAvatarUrl,
}: Pick<VoiceConversationTranscriptProps, "mentorName" | "mentorAvatarUrl">) {
  if (mentorAvatarUrl) {
    return (
      <img src={mentorAvatarUrl} alt={mentorName} className="size-9 rounded-full object-cover" />
    );
  }

  return (
    <div className="flex size-9 items-center justify-center rounded-full bg-primary-100 ring-1 ring-primary-200/70">
      <Icon name="AiMentor" className="size-6 p-0.5 text-primary-700" aria-label={mentorName} />
    </div>
  );
}

function MentorTimedText({ speech, text }: { speech: MentorSpeechPresentation; text: string }) {
  const segments = useMemo(() => getDisplaySegments(text, speech.words), [text, speech.words]);
  return (
    <span aria-hidden="true" className="whitespace-pre-wrap">
      {segments.map((segment) => (
        <span
          key={segment.offset}
          className={cn("rounded py-0.5", {
            "bg-primary-100 text-primary-950":
              segment.wordIndex !== null && segment.wordIndex === speech.activeWordIndex,
          })}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

export function VoiceConversationTranscript({
  learnerTranscript,
  mentorResponse,
  mentorSpeech,
  mentorName,
  mentorAvatarUrl,
}: VoiceConversationTranscriptProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUserSuspense();
  const isLearnerPartial = learnerTranscript?.status === LEARNER_TRANSCRIPT_STATUSES.PARTIAL;
  const hasMentorSpeech = Boolean(mentorSpeech?.words.length);
  const learnerDisplayName =
    `${currentUser?.firstName ?? ""} ${currentUser?.lastName ?? ""}`.trim() ||
    t("studentCourseView.lesson.aiMentorLesson.userName");

  if (!learnerTranscript && !mentorResponse) {
    return <div className="h-24" aria-hidden="true" />;
  }

  return (
    <div className="mx-auto flex min-h-24 w-full max-w-3xl flex-col justify-end gap-3">
      {learnerTranscript && (
        <div className="flex max-w-[88%] self-start items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <UserAvatar
              userName={learnerDisplayName}
              profilePictureUrl={currentUser?.profilePictureUrl}
              className="size-9"
            />
          </div>
          <div className="min-w-0 flex flex-col gap-1">
            <span className="text-sm font-semibold text-primary-900">{learnerDisplayName}</span>
            <div
              aria-live={isLearnerPartial ? "polite" : "off"}
              className={cn(
                "w-fit max-w-full rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed",
                {
                  "border border-neutral-200 bg-white/70 text-neutral-400": isLearnerPartial,
                  "border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm":
                    !isLearnerPartial,
                },
              )}
            >
              <span className={cn(!isLearnerPartial && "transcript-finalized-text")}>
                {learnerTranscript.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {mentorResponse && (
        <div className="flex max-w-[88%] items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <MentorAvatar mentorName={mentorName} mentorAvatarUrl={mentorAvatarUrl} />
          </div>
          <div className="min-w-0 flex flex-col gap-1">
            <span className="text-sm font-semibold text-primary-900">{mentorName}</span>
            <div className="rounded-2xl rounded-bl-md bg-white/90 px-4 py-3 text-sm leading-relaxed text-neutral-900 shadow-sm ring-1 ring-neutral-200/80">
              {hasMentorSpeech && mentorSpeech ? (
                <>
                  <span className="sr-only">{mentorResponse}</span>
                  <MentorTimedText speech={mentorSpeech} text={mentorResponse} />
                </>
              ) : (
                mentorResponse
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
