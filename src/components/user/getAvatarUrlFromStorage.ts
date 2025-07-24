import 'server-only';

import { createClient } from "@/lib/supabase/server";

export async function getAvatarUrlFromStorage(databaseUrl: string | null ) {
  const supabase = await createClient();

  if (databaseUrl) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(databaseUrl);
    return data.publicUrl;
  } else {
    return null;
  }
}
