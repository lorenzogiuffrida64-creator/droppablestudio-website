/**
 * Member wins on /school ("Straight from our students."). Real wins only:
 * a clip or image, the member's first name, one line. The grid stays hidden
 * while this list is empty.
 *
 * Example:
 *   { media: { type: "video", src: "/method/wins/<name>.mp4", poster: "/method/wins/<name>.jpg" },
 *     name: "<first name>", line: "<one line, in their words>" }
 */
export type MemberWin = {
  media:
    | { type: "video"; src: string; poster?: string }
    | { type: "image"; src: string; alt: string };
  name: string;
  line: string;
};

export const MEMBER_WINS: MemberWin[] = [];
