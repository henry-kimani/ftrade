import DownloadFproxy from "@/components/DownloadFproxy";
import SiteHeader from "@/components/SiteHeader";
import SyncToMt from "@/components/SyncToMT";
import { isUserAdmin } from "@/db/queries";
import { checkUserRoleIsNone, verifyUser } from "@/lib/dal";

export default async function SyncData() {
  await checkUserRoleIsNone();
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);

  return (
    <main>
      <div>
        <SiteHeader heading="sync data" />
      </div>
      <div className="max-w-4xl mx-auto p-4 mt-5">
        {isAdmin ? 
          <div>
            <SyncToMt />
            <DownloadFproxy />
          </div>:
          <div>
            <p className="text-xl text-muted-foreground">You are not an admin.</p>
          </div>
        }
      </div>
    </main>
  );
}
