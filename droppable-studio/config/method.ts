/**
 * The Droppable Method — landing page content (/preorder).
 *
 * Rule: nothing here is invented. Confirmed copy is filled in; everything else
 * is `null` (or an empty list). A `null` section is hidden in production and
 * shows a dashed [[PLACEHOLDER]] box in development, so nothing fake can ship.
 * Prices and dates live in config/preorder.ts, never here.
 */
import { PREORDER, formatPrice } from "@/config/preorder";

/* What's inside — confirmed, already on the live site. Shared with the
   homepage Skool card so the two never say different things. */
export const SCHOOL = {
  lessonCount: 78,
  /* SOP: ask which currency — defaulted to € */
  agencyGoal: "€5–10k/mo",
  includes: [
    "The full blueprint behind each and every Droppable campaign",
    "Weekly drops: Claude Codes, Claude Skills, AI tools & insider secrets",
    "Open your first AI marketing agency and scale it to €5–10k/mo",
    "Weekly live workshops (meet the founders)",
    "Private premium operator network",
  ],
};

/* Founders-only bonuses — pre-order only, removed when the school opens.
   Prices are never written here: they come from config/preorder.ts. */
export type Bonus = {
  id: "pdf" | "sheets";
  /* the big number / word on the object */
  figure: string;
  title: string;
  subtitle?: string;
  line: string;
};

export const BONUSES: Bonus[] = [
  {
    id: "pdf",
    figure: "600",
    title: "The Droppable Codex",
    line: "600 pages. Every prompt behind 10 months of Droppable Studio campaigns in Higgsfield.",
  },
  {
    id: "sheets",
    figure: "Sheets",
    title: "The Decoder",
    subtitle: "Model Language Sheets",
    line: "The exact words AI models actually understand, and the sources we pull our references from.",
  },
];

/* locked: the file is blurred at encode time and the card shows a lock + the
   class name instead (for modules whose lessons aren't titled yet) */
export type TestimonialClip = { src: string; name: string; aspect: number };
export type TestimonialChat = {
  src: string; width: number; height: number; alt: string;
  /* show the whole screenshot at its own ratio instead of the 5:6 crop + fade */
  full?: boolean;
};

export type Mentor = { name: string; role: string; photo: string; focus: string };

export type ClassroomShot = {
  src: string;
  label: string;
  title: string;
  locked?: boolean;
  /* locked cards only: one curiosity line over the blur */
  teaser?: string;
};

export type FaqItem = { id: string; q: string; a: string | null };

export const METHOD = {
  hero: {
    /* SOP draft — Lorenzo to approve */
    headline: "Learn the exact system behind every Droppable campaign",
    headlineAccent: "and get paid for it.",
    sub: "For founders, creators and future agency owners.",
  },

  /* 16:9 MP4 with burned-in captions, e.g. { src: "/method/founder.mp4",
     webm: "/method/founder.webm", poster: "/method/founder.jpg",
     captions: "/method/founder.vtt" }. Until then the hero shows an empty 16:9 frame. */
  founderVideo: {
    /* the pre-order VSL — 720p H.264 + AAC, faststart (master in Droppable-studio-video/) */
    src: "/method/vsl.mp4",
    /* phones get a lighter 480p cut (2.6 MB vs 4.1 MB) — most traffic is mobile data */
    srcMobile: "/method/vsl-480.mp4",
    poster: "/method/vsl-poster.jpg",
  } as null | {
    src: string;
    srcMobile?: string;
    webm?: string;
    poster: string;
    captions?: string;
  },


  /* Skool classroom screenshots — cropped to the lesson column (640x1546 WebP;
     locked ones 320x774, blurred), a swipeable carousel in "What's inside" */
  classroom: [
    { src: "/method/classroom/01.webp", label: "Phase 1", title: "Foundations" },
    { src: "/method/classroom/02.webp", label: "Phase 2", title: "AI Image Creation" },
    { src: "/method/classroom/03.webp", label: "Phase 3", title: "AI Filmmaking" },
    { src: "/method/classroom/04.webp", label: "Phase 3", title: "AI Filmmaking — production" },
    { src: "/method/classroom/05.webp", label: "Phase 3", title: "AI Filmmaking — the finish" },
    { src: "/method/classroom/06.webp", label: "Phase 4", title: "AI UGC Videos" },
    { src: "/method/classroom/07.webp", label: "Phase 5", title: "Node-Based Workflows" },
    {
      src: "/method/classroom/08.webp",
      label: "Phase 6",
      title: "AI Agency",
      locked: true,
      teaser: "Turn your renders into revenue.",
    },
    {
      src: "/method/classroom/09.webp",
      label: "Beyond",
      title: "Scaling / Mastery",
      locked: true,
      teaser: "Grow from one client to a company.",
    },
  ] as ClassroomShot[],

  /* the outcome as a sequence — from the current site copy, Lorenzo to confirm */
  path: [
    { title: "Your first render", line: "Master the tools we use, from zero." },
    { title: "The real workflow", line: "The workflow behind every Droppable campaign." },
    { title: "Your first client", line: "Open your own AI marketing agency." },
    { title: "Scale it", line: `Grow the agency to ${SCHOOL.agencyGoal}.` },
  ],

  /* the mentors — photos cropped 4:5, WebP at 600 + 1000px wide */
  mentors: [
    {
      name: "Lorenzo Giuffrida",
      role: "Founder of Droppable Studio & AI visual director",
      photo: "/method/mentors/lorenzo",
      /* where the face sits, so the crop keeps it on narrow screens */
      focus: "55% 40%",
    },
    {
      name: "Michael Alfred",
      role: "Operational systems",
      photo: "/method/mentors/michael",
      focus: "42% 45%",
    },
  ] as Mentor[],

  /* testimonials — real call clips (audio kept; Alisa's cropped to the two
     people on the call) and real chats (cropped, status bars removed) */
  testimonials: {
    clips: [
      { src: "/method/testimonials/alisa-real", name: "Alisa", aspect: 1048 / 720 },
      { src: "/method/testimonials/hamed-2x", name: "Hamed", aspect: 1280 / 720 },
      { src: "/method/testimonials/soner", name: "Soner", aspect: 1280 / 720 },
      { src: "/method/testimonials/alisa-answers", name: "Alisa", aspect: 1048 / 720 },
    ] as TestimonialClip[],
    chats: [
      { src: "/method/testimonials/chat-kolar.webp", width: 640, height: 768, alt: "Message from a student after a one-hour session: \"I now feel fully equipped to go all-in and make things happen.\"" },
      { src: "/method/testimonials/chat-alisa.webp", width: 640, height: 768, alt: "Message from a student: \"I've genuinely learned a lot. I'm really happy to be working with you!\"" },
      { src: "/method/testimonials/chat-aly.webp", width: 640, height: 1115, full: true, alt: "A student sharing his AI video shots: \"yes they really really helped\"" },
      { src: "/method/testimonials/chat-aly-video.webp", width: 640, height: 768, alt: "A student sharing his AI surf video: \"yeah you really really helped me\"" },
      { src: "/method/testimonials/chat-discord.webp", width: 640, height: 768, alt: "Reactions to Droppable Studio work in the Discord community" },
    ] as TestimonialChat[],
  },

  /* what founding members keep after launch — depends on input #1
     (monthly price locked forever vs one-time payment) */
  foundingKeeps: null as null | string,

  /* school FAQ — Lorenzo's copy (2026-09-30) */
  faq: [
    {
      id: "why-us",
      q: "Why should I learn this from you?",
      a: "We're Droppable Studio, an AI marketing agency. In the last six months we've worked with over 30 brands, grown our audience by more than 11,000 followers, and built a community of 600 members. Everything we teach is what we use every day to run the agency. It's not theory.",
    },
    {
      id: "experience",
      q: "I have zero experience with AI. Is this for me?",
      a: "Yes, this was built for you. We start from zero: what AI is, how the models actually work, and which tools are worth your time. Then we go through every type of AI tool, step by step. If you've never generated anything before, this is the best place to start.",
    },
    {
      id: "saturated",
      q: "Isn't AI content already saturated?",
      a: "Think of e-commerce twenty years ago, but with far more room to grow. Almost every brand needs content, and AI lets you deliver almost any kind of it. We're still at the beginning, and the people who build the skill now are the ones who'll lead the market later.",
    },
    {
      id: "youtube",
      q: "Can't I learn all of this for free on YouTube?",
      a: "You can find pieces of it on YouTube. What you won't find is a clear, organized path. Most people spend months jumping between messy tutorials and low-quality videos, then waste even more money on failed generations. They save on a monthly subscription and end up losing three times as much in time and money. The school gives you the exact path, in order, from people who use it every day.",
    },
    {
      id: "price",
      q: `Why ${formatPrice(PREORDER.launchPriceCents)} a month?`,
      a: `Because we're building a premium space, not a crowd. A €7 community with 30,000 members never feels like a real community. At ${formatPrice(
        PREORDER.launchPriceCents
      )}, everyone inside has invested in being there, which means they show up, share what's working, and push each other forward. The price protects the quality of the room you're paying to be in.`,
    },
    {
      id: "works",
      q: "Does this actually work?",
      a: "Think of a personal trainer. They can give you the perfect training plan and the perfect diet, but you're the one who has to do the workouts. We give you everything we use to run a real AI agency. The results come from the action you take with it.",
    },
    {
      id: "clients",
      q: "I don't know how to find clients or sell. Will you teach that?",
      a: "Yes. The final module, Scaling and Mastering Your AI Agency, covers exactly that: how to find clients, sell your services, and grow the agency.",
    },
  ] as FaqItem[],

  /* success page: what happens after purchase */
  postPurchase: null as null | string[],

  /* founding-member counter. source "manual" reads `value`; hidden below `minToShow` */
  counter: {
    source: "manual" as const,
    /* Lorenzo, 2026-09-30: 150+ pre-orders — update as it grows */
    value: 150,
    /* shows "150+" — a floor, not an exact live count */
    plus: true,
    minToShow: 25,
    label: "already pre-ordered",
  },
};
