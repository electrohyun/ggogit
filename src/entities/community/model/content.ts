import type { CommunityPost } from "./types";

interface CommunityParagraphBlock {
  kind: "paragraph";
  text: string;
}

export const getCommunityFirstParagraph = (post: CommunityPost) =>
  post.content.find((block) => block.kind === "paragraph")?.text ?? "";

export const createCommunityParagraphBlocks = (
  text: string,
): CommunityParagraphBlock[] => [
  {
    kind: "paragraph",
    text,
  },
];
