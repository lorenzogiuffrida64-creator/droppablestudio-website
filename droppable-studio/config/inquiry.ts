/* /inquiry?type=… from the /school "Go further" cards: sent as a hidden
   field so the notification says which track the lead applied for */
export const INQUIRY_TYPES = {
  mentorship: "1:1 Mentorship application",
  team: "Production team application",
} as const;
export type InquiryType = keyof typeof INQUIRY_TYPES;
