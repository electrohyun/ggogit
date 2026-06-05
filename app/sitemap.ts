import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/shared/lib/seo/metadata";

const SITEMAP_ROUTES = [
  {
    path: "/",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/lobby",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/study",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/challenge",
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    path: "/community",
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    path: "/community/notices",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/community/questions",
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    path: "/community/tips",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/credits",
    changeFrequency: "yearly",
    priority: 0.5,
  },
] satisfies Array<{
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  path: string;
  priority: number;
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return SITEMAP_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
