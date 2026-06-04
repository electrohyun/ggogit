import { NextResponse, type NextRequest } from "next/server";

const GUEST_ENTRY_COOKIE = "ggogit_entry";

export function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(`${requestUrl.origin}/lobby`);

  response.cookies.set(GUEST_ENTRY_COOKIE, "guest", {
    httpOnly: true, // 브라우저 JavaScript에서 접근 불가능
    sameSite: "lax", // CSRF 공격 방지
    secure: process.env.NODE_ENV === "production", // 배포 환경에서는 HTTPS에서만 쿠키 전송
    path: "/", // 앱 전체에서 이 쿠키 사용가능
    maxAge: 60 * 60 * 24, // 쿠키 유지 시간.
  });

  return response;
}
