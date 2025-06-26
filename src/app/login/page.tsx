import LoginForm from "@/components/forms/LoginForm";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function LoginPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error || data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center">
      <div className="fixed top-0 w-full">
        <SiteHeader isLogin heading="Login" />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
