import { NextResponse, type NextRequest } from "next/server";
import {
  createGuestName,
  GUEST_ENTRY_COOKIE,
  GUEST_NAME_COOKIE,
  GUEST_SESSION_ID_COOKIE,
} from "@/entities/user/model/guestIdentity";
import { createClient } from "@/shared/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const response = NextResponse.redirect(`${requestUrl.origin}/lobby`);
  const guestName =
    request.cookies.get(GUEST_NAME_COOKIE)?.value ?? createGuestName();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        name: guestName,
      },
    },
  });

  if (error) {
    console.error("Failed to start anonymous guest session", error);

    return NextResponse.redirect(requestUrl.origin);
  }

  const { error: initializationError } = await supabase.rpc(
    "ensure_user_app_data",
  );

  if (initializationError) {
    console.error("Failed to initialize anonymous guest data", initializationError);

    return NextResponse.redirect(requestUrl.origin);
  }

  response.cookies.delete(GUEST_ENTRY_COOKIE);
  response.cookies.delete(GUEST_NAME_COOKIE);
  response.cookies.delete(GUEST_SESSION_ID_COOKIE);

  return response;
}
