import { NextResponse, type NextRequest } from "next/server";

import {
  createGuestName,
  createGuestSessionId,
  GUEST_ENTRY_COOKIE,
  GUEST_NAME_COOKIE,
  GUEST_SESSION_ID_COOKIE,
} from "@/entities/user/model/guestIdentity";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(`${requestUrl.origin}/lobby`);
  const guestName =
    request.cookies.get(GUEST_NAME_COOKIE)?.value ?? createGuestName();
  const guestSessionId =
    request.cookies.get(GUEST_SESSION_ID_COOKIE)?.value ?? createGuestSessionId();

  response.cookies.set(GUEST_ENTRY_COOKIE, "guest", {
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set(GUEST_NAME_COOKIE, guestName, {
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set(GUEST_SESSION_ID_COOKIE, guestSessionId, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
