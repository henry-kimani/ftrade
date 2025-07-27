import 'server-only';

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { verifyUser } from "@/lib/dal";
import { getUserAvatarURl } from "@/db/queries";
import { getAvatarUrlFromStorage } from './getAvatarUrlFromStorage';
import UserAvatar from '@/components/user/UserAvatar';

export default async function UserEmailProfile() {
  const { user } = await verifyUser();
  const { avatarUrl } = await getUserAvatarURl(user.id);

  const publicUrl = await getAvatarUrlFromStorage(avatarUrl);

  const fallbackLetter = user.email?.charAt(0).toUpperCase() || "U";
  return (
    <div>
      <SidebarMenuButton size={"lg"} asChild>
        <div>
          <div style={{ minWidth: 30 }}>
            <UserAvatar imgUrl={publicUrl} fallbackLetter={fallbackLetter} className='size-8 !text-lg'/>
          </div>
          <span>{user.email}</span>
        </div>
      </SidebarMenuButton>
    </div>
  );
}
