import { type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const supabase  = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type
    });

    // Redirect the user to the specified url 
    if (error) {
      if (error.code === "otp_expired") {
        return redirect("/expired");
      }
      console.error(error);
      return redirect("/error");
    }

    return redirect("/dashboard");

  }

  return redirect("/error");

}
