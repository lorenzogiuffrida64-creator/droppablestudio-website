/**
 * /school — page content. Facts (prices, dates, counts) live in
 * config/school.ts and are only read here, never written.
 * Copy rule: short lines, no em dashes.
 */
import { school, trialLine } from "@/config/school";

export type TestimonialClip = { src: string; name: string; aspect: number };
export type TestimonialChat = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /* show the whole screenshot at its own ratio instead of the 5:6 crop + fade */
  full?: boolean;
};

/* a classroom card: a real Skool screenshot, or a text card when there's no
   clean screenshot yet (drop the 640x1546 WebP in and set `src`) */
export type ClassroomCard = {
  label: string;
  title: string;
  src?: string;
  line?: string;
  items?: string[];
};

export type FaqItem = {
  id: string;
  q: string;
  a: string;
  links?: { label: string; href: string }[];
};

export const HERO = {
  headline: "Create AI commercials",
  headlineAccent: "brands actually pay for.",
  sub: "The exact method behind every Droppable Studio campaign. Start with a 7-day challenge, finish with your first client.",
  cta: "Start the 7-Day Challenge",
};

/* the pre-launch VSL: 720p H.264 + AAC, a lighter 480p cut for phones */
export const HERO_VIDEO = {
  src: "/method/vsl.mp4",
  srcMobile: "/method/vsl-480.mp4",
  poster: "/method/vsl-poster.jpg",
} as null | {
  src: string;
  srcMobile?: string;
  webm?: string;
  poster: string;
  captions?: string;
};

/* real call clips (audio kept) and real chats (cropped, status bars removed) */
export const TESTIMONIALS = {
  clips: [
    { src: "/method/testimonials/alisa-answers", name: "Alisa", aspect: 1048 / 720 },
    { src: "/method/testimonials/alisa-real", name: "Alisa", aspect: 1048 / 720 },
    { src: "/method/testimonials/hamed-2x", name: "Hamed", aspect: 1280 / 720 },
    { src: "/method/testimonials/soner", name: "Soner", aspect: 1280 / 720 },
  ] as TestimonialClip[],
  chats: [
    { src: "/method/testimonials/chat-kolar.webp", width: 640, height: 768, alt: "Message from a student after a one-hour session: \"I now feel fully equipped to go all-in and make things happen.\"" },
    { src: "/method/testimonials/chat-alisa.webp", width: 640, height: 768, alt: "Message from a student: \"I've genuinely learned a lot. I'm really happy to be working with you!\"" },
    { src: "/method/testimonials/chat-aly.webp", width: 640, height: 1115, full: true, alt: "A student sharing his AI video shots: \"yes they really really helped\"" },
    { src: "/method/testimonials/chat-aly-video.webp", width: 640, height: 768, alt: "A student sharing his AI surf video: \"yeah you really really helped me\"" },
    { src: "/method/testimonials/chat-discord.webp", width: 640, height: 768, alt: "Reactions to Droppable Studio work in the Discord community" },
  ] as TestimonialChat[],
};

export const CHALLENGE = {
  title: "Your first AI ad",
  titleAccent: "in 7 days.",
  days: [
    "Your first realistic AI image",
    "Lock a consistent character and product",
    "Your first cinematic shot",
    "A 3-shot sequence that flows",
    "Sound design and colour grade",
    "A 15-second spec ad for a real brand",
    "Post it in the community and send it to the brand",
  ],
  note: "No film or tech background needed. You get feedback from us and the community every day.",
};

export const ROADMAP = [
  { when: "Week 1", title: "7-Day Challenge", line: "Your first ad." },
  { when: "Weeks 2–6", title: "The real workflow", line: "Image, film, UGC, node workflows." },
  { when: "Weeks 7–10", title: "Your first client", line: "Offer, outreach, sales calls." },
  { when: "Weeks 11–13", title: "Scale it", line: "Pricing, systems, team." },
];

/* Skool classroom screenshots, cropped to the lesson column (640x1546 WebP).
   Phases 6 and 7 have no clean screenshot yet: the old files were blurred at
   encode time, so they show as text cards until real ones are exported. */
export const CLASSROOM: ClassroomCard[] = [
  { src: "/method/classroom/01.webp", label: "Phase 1", title: "Foundations" },
  { src: "/method/classroom/02.webp", label: "Phase 2", title: "AI Image Creation" },
  { src: "/method/classroom/03.webp", label: "Phase 3", title: "AI Filmmaking" },
  { src: "/method/classroom/04.webp", label: "Phase 3", title: "AI Filmmaking: production" },
  { src: "/method/classroom/05.webp", label: "Phase 3", title: "AI Filmmaking: the finish" },
  { src: "/method/classroom/06.webp", label: "Phase 4", title: "AI UGC Videos" },
  { src: "/method/classroom/07.webp", label: "Phase 5", title: "Node-Based Workflows" },
  { label: "Phase 6", title: "AI Agency", line: "Turn your renders into revenue." },
  { label: "Phase 7", title: "Scaling / Mastery", line: "Grow from one client to a company." },
  {
    label: "Bonus",
    title: "The Vault",
    items: [
      "Prompt Banks (356 + 218 pages)",
      "LUT packs",
      "Brief templates",
      "Prompt kits",
      "Lesson transcripts",
    ],
  },
];

export const INSIDE = [
  `${school.lessons} lessons across ${school.phases} phases + homework after every module`,
  "The full workflow behind every Droppable campaign",
  "The Vault: prompt banks, LUTs, templates, kits",
  "Weekly live calls with the founders (replays included)",
  "Agency playbook: niche, offer, outreach, the two-call close, delivery",
  "A community that gives feedback on your work",
  "Earn as you level up: 1:1 call with Lorenzo, cash prizes, AI tool credits",
];

export const GO_FURTHER = [
  {
    id: "mentorship",
    title: "1:1 Mentorship with Lorenzo",
    line: "For members who want a direct path to their first clients, with me in your corner.",
    href: "/inquiry?type=mentorship",
  },
  {
    id: "team",
    title: "Join the Droppable production team",
    line: "Our best members produce real client commercials with the studio. Finish the challenge, show us two spec ads, apply.",
    href: "/inquiry?type=team",
  },
];

const whyUs = [
  "We're Droppable Studio, an AI marketing agency.",
  school.brandsWorkedWith
    ? `We've worked with over ${school.brandsWorkedWith} brands.`
    : null,
  "Everything we teach is what we use every day to run the agency. It's not theory.",
]
  .filter(Boolean)
  .join(" ");

const trial = trialLine();

/* school FAQ. Rows that depend on a config value drop out when it's off. */
export const FAQ: FaqItem[] = [
  { id: "why-us", q: "Why should I learn this from you?", a: whyUs },
  {
    id: "first-7-days",
    q: "What happens in my first 7 days?",
    a: "You start the 7-Day Challenge. One task a day, from your first realistic AI image to a 15-second spec ad for a real brand. You post every task in the community and get feedback from us and the other members. Your first weekly live call is where you meet the founders and ask anything. On Day 7 you post your ad and send it to the brand.",
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
    q: `Why ${school.priceMonthly} a month?`,
    a: `Because we're building a premium space, not a crowd. A $7 community with 30,000 members never feels like a real community. At ${school.priceMonthly}, everyone inside has invested in being there, which means they show up, share what's working, and push each other forward. The price protects the quality of the room you're paying to be in.`,
  },
  {
    id: "price-up",
    q: "Will the price go up?",
    a: "Yes, the price rises as the community grows. Join now and your price stays locked as long as your subscription stays active.",
  },
  ...(trial
    ? [
        {
          id: "trial",
          q: "Is there a free trial?",
          a: `Yes, a ${trial}. Cancel before it ends from your Skool settings and you won't be charged.`,
        },
      ]
    : []),
  { id: "cancel", q: "Can I cancel?", a: "Yes, anytime from your Skool settings." },
  {
    id: "works",
    q: "Does this actually work?",
    a: "Think of a personal trainer. They can give you the perfect training plan and the perfect diet, but you're the one who has to do the workouts. We give you everything we use to run a real AI agency. The results come from the action you take with it.",
  },
  {
    id: "clients",
    q: "I don't know how to find clients or sell. Will you teach that?",
    a: "Yes. Phase 6, AI Agency, covers exactly that: your niche, your offer, outreach, the two-call close and delivery. Phase 7 is about scaling it.",
  },
  {
    id: "brands",
    q: "Do you also work with brands?",
    a: "Yes. Droppable Studio is an AI marketing agency first. We make AI campaigns for premium brands.",
    links: [
      { label: "See the studio", href: "/" },
      { label: "Start a project", href: "/inquiry" },
    ],
  },
];
