import { LEARNER_TRANSCRIPT_STATUSES } from "@repo/shared";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWith } from "~/utils/testUtils";

import { VoiceConversationTranscript } from "./VoiceConversationTranscript";

vi.mock("~/api/queries", () => ({
  useCurrentUserSuspense: vi.fn(() => ({
    data: {
      firstName: "Kaylah",
      lastName: "Admin",
      profilePictureUrl: "https://example.com/kaylah.png",
    },
  })),
}));

describe("VoiceConversationTranscript", () => {
  it("keeps learner messages on the left with the mentor conversation", () => {
    renderWith().render(
      <VoiceConversationTranscript
        learnerTranscript={{
          text: "I would like a discount",
          turnId: "turn-1",
          segmentId: "segment-1",
          revision: 1,
          status: LEARNER_TRANSCRIPT_STATUSES.FINAL,
        }}
        mentorResponse="How can I help?"
        mentorSpeech={null}
        mentorName="Mentor"
      />,
    );

    const learnerMessage = screen.getByText("I would like a discount").parentElement;
    const learnerRow = learnerMessage?.parentElement?.parentElement;
    const learnerAvatar = screen.getByText("Kaylah Admin").parentElement?.previousElementSibling;

    expect(screen.getByText("Kaylah Admin")).toBeInTheDocument();
    expect(screen.getByText("Mentor")).toBeInTheDocument();
    expect(learnerAvatar).toHaveClass("mt-0.5", "shrink-0");
    expect(learnerAvatar?.querySelector(".size-9")).toBeInTheDocument();
    expect(learnerRow).toHaveClass("self-start");
    expect(learnerMessage).toHaveClass("rounded-bl-md");
    expect(learnerMessage).not.toHaveClass("ml-auto", "rounded-br-md");
  });
});

describe("canonical mentor display with speech alignment", () => {
  it.each([
    { text: "Wynik: 0,47.\nUżyj <button>", word: "0,47", highlighted: true },
    { text: "Wynik: 0,47.", word: "zero przecinek cztery siedem", highlighted: false },
    { text: "Wynik: 0,47.", word: "47", highlighted: false },
    { text: "Hello,  world!", word: "Hello", highlighted: true },
  ])("preserves $text when alignment contains $word", ({ text, word, highlighted }) => {
    const { container } = renderWith().render(
      <VoiceConversationTranscript
        learnerTranscript={null}
        mentorResponse={text}
        mentorSpeech={{
          turnId: "turn-1",
          sequence: 1,
          words: [{ text: word, startMs: 0, endMs: 100 }],
          activeWordIndex: 0,
        }}
        mentorName="Mentor"
      />,
    );
    const visibleText = container.querySelector("span[aria-hidden='true']");
    expect(visibleText?.textContent).toBe(text);
    expect(visibleText?.querySelector("button")).toBeNull();
    expect(Boolean(visibleText?.querySelector(".bg-primary-100"))).toBe(highlighted);
  });

  it("keeps the full response visible when timing covers only its beginning", () => {
    const { container } = renderWith().render(
      <VoiceConversationTranscript
        learnerTranscript={null}
        mentorResponse="Hello, world! More words arrive."
        mentorSpeech={{
          turnId: "turn-1",
          sequence: 1,
          words: [{ text: "Hello", startMs: 0, endMs: 100 }],
          activeWordIndex: 0,
        }}
        mentorName="Mentor"
      />,
    );
    expect(container.querySelector("span[aria-hidden='true']")?.textContent).toBe(
      "Hello, world! More words arrive.",
    );
  });
});
