import { NextResponse, type NextRequest } from "next/server";
import {
  createGuestName,
  createGuestSessionId,
  GUEST_ENTRY_COOKIE,
  GUEST_NAME_COOKIE,
  GUEST_SESSION_ID_COOKIE,
} from "@/entities/user/model/guestIdentity";

const GUEST_COOKIE_MAX_AGE = 60 * 60 * 24;

export function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(`${requestUrl.origin}/lobby`);
  const guestSessionId =
    request.cookies.get(GUEST_SESSION_ID_COOKIE)?.value ??
    createGuestSessionId();
  const guestName =
    request.cookies.get(GUEST_NAME_COOKIE)?.value ?? createGuestName();

  response.cookies.set(GUEST_ENTRY_COOKIE, "guest", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });
  response.cookies.set(GUEST_SESSION_ID_COOKIE, guestSessionId, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });
  response.cookies.set(GUEST_NAME_COOKIE, guestName, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE,
  });

  return response;
}
