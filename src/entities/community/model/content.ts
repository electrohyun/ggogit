import type { CommunityPost } from "./types";

export const getCommunityFirstParagraph = (post: CommunityPost) =>
  post.content.find((block) => block.kind === "paragraph")?.text ?? "";
