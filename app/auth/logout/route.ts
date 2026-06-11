import { NextResponse, type NextRequest } from "next/server";

import {
  GUEST_ENTRY_COOKIE,
  GUEST_NAME_COOKIE,
  GUEST_SESSION_ID_COOKIE,
} from "@/entities/user/model/guestIdentity";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  await supabase.auth.signOut();

  const response = NextResponse.redirect(requestUrl.origin);

  response.cookies.delete(GUEST_ENTRY_COOKIE);
  response.cookies.delete(GUEST_NAME_COOKIE);
  response.cookies.delete(GUEST_SESSION_ID_COOKIE);

  return response;
}
