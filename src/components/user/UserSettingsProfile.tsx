import { Card, CardContent } from "@/components/ui/card";
import LogoutForm from "@/components/forms/LogoutForm";
import AvatarForm from "@/components/forms/AvatarForm";
import UserAvatar from "@/components/user/UserAvatar";
import { getUserAvatarURl } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserSettingsProfile() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const { avatarUrl } = await getUserAvatarURl(user.id);

  let imgUrl: string | undefined = undefined;

  if (avatarUrl) {
    const { data: imgBlobData } = supabase.storage.from('avatars').getPublicUrl(avatarUrl);
    console.log('Image data: ', imgBlobData);
    imgUrl = imgBlobData?.publicUrl;
  } 

  return (
    <div>
      <Card className="max-w-lg mx-auto border-none !bg-transparent">
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-5">
            <UserAvatar imgUrl={imgUrl} className="!size-20" fallbackLetter={user.email?.charAt(0).toUpperCase() || "U"}/>

            <div className="grid gap-2">
              <span className="text-lg font-semibold text-ellipsis">
                {user.email}
              </span>
              <span><AvatarForm /></span>
              <LogoutForm />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
