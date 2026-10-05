/**
 * Live Discord member count, read from the public invite endpoint
 * (no bot or token needed). Cached for a minute so the page stays static-fast.
 */
export const DISCORD = {
  inviteCode: "UXSFf7t7Zd",
  /* first N members join free, then the entry fee applies */
  freeSpots: 1000,
  entryFee: "€5",
} as const;

export async function getDiscordMemberCount(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${DISCORD.inviteCode}?with_counts=true`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { approximate_member_count?: number };
    return typeof data.approximate_member_count === "number"
      ? data.approximate_member_count
      : null;
  } catch {
    return null;
  }
}
