import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/shared/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/challenge/play",
        "/community/questions/new",
        "/design-system",
        "/profile",
        "/profile/",
        "/profile/*",
        "/study/*/*",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
