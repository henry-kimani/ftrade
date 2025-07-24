import 'server-only';

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { verifyUser } from "@/lib/dal";
import { getUserAvatarURl } from "@/db/queries";
import { getAvatarUrlFromStorage } from './getAvatarUrlFromStorage';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

export default async function UserEmailProfile() {
  const { user } = await verifyUser();
  const { avatarUrl } = await getUserAvatarURl(user.id);

  const publicUrl = await getAvatarUrlFromStorage(avatarUrl);

  if (!publicUrl) {
    return;
  }

  const fallbackLetter = user.email?.charAt(0).toUpperCase() || "U";
  return (
    <div>
      <SidebarMenuButton size={"lg"} asChild>
        <div>
          <Avatar>
            <AvatarImage src={publicUrl}/>
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
          <div><span>{user.email}</span></div>
        </div>
      </SidebarMenuButton>
    </div>
  );
}
