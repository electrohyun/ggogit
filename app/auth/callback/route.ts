import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code"); // 현재 code 파라미터
  const origin = requestUrl.origin; // 현재 App 주소

  if (code) {
    // 서버용 클라이언트 생성
    const supabase = await createClient();
    // 코드 -> 슈퍼베이스 확인 -> 토큰발급 -> 쿠키 저장
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { error: initializationError } = await supabase.rpc(
        "ensure_user_app_data",
      );

      if (initializationError) {
        console.error(
          "Failed to initialize user app data",
          initializationError,
        );

        return NextResponse.redirect(origin);
      }

      return NextResponse.redirect(`${origin}/lobby`);
    }
  }

  return NextResponse.redirect(origin);
}
