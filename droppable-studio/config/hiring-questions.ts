/**
 * AI Artist application — the Loom video brief shown on /apply
 * (see components/hiring/*). Edit questions here; the layout maps over them.
 * Questions are numbered 1…n continuously across parts, and the total target
 * length is the sum of each part's minutes — both computed, never hard-coded.
 */
export type HiringQuestion = {
  text: string;
  /** optional lead-in for a bullet list, e.g. "Then explain:" */
  followUp?: string;
  bullets?: string[];
};

export type HiringPart = {
  title: string;
  /** target length in minutes ("about N min") */
  minutes: number;
  /** candidate must share their screen for this part */
  screenShare?: boolean;
  questions: HiringQuestion[];
};

export const PARTS: HiringPart[] = [
  {
    title: "Who you are",
    minutes: 1,
    questions: [
      {
        text: "Who are you, where are you based, and how long have you been creating with AI?",
      },
      {
        text: "Which AI tools and models do you use most, and which one are you strongest in?",
      },
    ],
  },
  {
    title: "Your work",
    minutes: 3,
    screenShare: true,
    questions: [
      {
        text: "Show the 2–3 best pieces in your portfolio. For each one, explain the goal of the video and exactly what you did on it.",
      },
      {
        text: "Choose one of those pieces and break down your process from start to finish: the idea, the scenes structure, the prompts, the generations, the editing, and the final result.",
      },
      {
        text: "Show one generation that didn’t work. Explain what went wrong and how you fixed it.",
      },
    ],
  },
  {
    title: "How you work",
    minutes: 2,
    questions: [
      {
        text: "How do you keep characters, products, and a brand’s look consistent across different shots and scenes?",
      },
      {
        text: "How fast can you deliver a 15–30 second commercial, and how many hours per week can you dedicate to client projects?",
      },
    ],
  },
  {
    title: "Why you",
    minutes: 1,
    questions: [
      {
        text: "Why do you want to work with Droppable Studio, and what would you bring to the team that others can’t?",
      },
    ],
  },
];

export const QUESTION_COUNT = PARTS.reduce((n, p) => n + p.questions.length, 0);
export const TOTAL_MINUTES = PARTS.reduce((n, p) => n + p.minutes, 0);

export const STEPS: { title: string; text: string }[] = [
  {
    title: "Record",
    text: `Record one Loom video answering all ${QUESTION_COUNT} questions below, in order.`,
  },
  {
    title: "Show",
    text: "Keep your camera on and share your screen whenever you show your work.",
  },
  {
    title: "Submit",
    text: "Paste your Loom link in the form at the bottom of this page.",
  },
];
