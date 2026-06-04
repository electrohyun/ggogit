import { GUEST_ENTRY_COOKIE } from "@/features/auth/model/session";
import { createClient } from "@/shared/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  await supabase.auth.signOut();

  const response = NextResponse.redirect(requestUrl.origin);

  response.cookies.delete(GUEST_ENTRY_COOKIE);

  return response;
}
