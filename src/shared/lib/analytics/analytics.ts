"use client";

import { track } from "@vercel/analytics";

type AnalyticsValue = number | string | boolean | null;

export const trackEvent = (
  name: string,
  properties?: Record<string, AnalyticsValue>,
) => {
  track(name, properties);
};
