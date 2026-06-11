"use client";

import { useEffect, useState } from "react";

import { viewCommunityPost } from "@/features/community/api/communityReactions.action";
import { getOrCreateGuestIdentity } from "@/entities/user";

interface CommunityPostViewCounterProps {
  postId: number;
  initialViewCount: number;
}

export default function CommunityPostViewCounter({
  postId,
  initialViewCount,
}: CommunityPostViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialViewCount);

  useEffect(() => {
    const identity = getOrCreateGuestIdentity();
    let isMounted = true;

    const trackView = async () => {
      const result = await viewCommunityPost({
        postId,
        guestSessionId: identity.guestSessionId,
      });

      if (isMounted && result.ok) {
        setViewCount(result.data.viewCount);
      }
    };

    void trackView();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  return <>조회 {viewCount}</>;
}
