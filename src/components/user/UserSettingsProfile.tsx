import { Card, CardContent } from "@/components/ui/card";
import LogoutForm from "@/components/forms/LogoutForm";
import AvatarForm from "@/components/forms/AvatarForm";
import UserAvatar from "@/components/user/UserAvatar";
import { getUserAvatarURl } from "@/db/queries";
import { getAvatarUrlFromStorage } from "./getAvatarUrlFromStorage";
import { verifyUser } from "@/lib/dal";

export default async function UserSettingsProfile() {
  const { user } = await verifyUser();
  const { avatarUrl } = await getUserAvatarURl(user.id);

  const publicUrl = await getAvatarUrlFromStorage(avatarUrl);

  return (
    <div>
      <Card className="max-w-lg mx-auto border-none !bg-transparent">
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-5">
            <UserAvatar imgUrl={publicUrl} className="!size-20" fallbackLetter={user.email?.charAt(0).toUpperCase() || "U"}/>

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
