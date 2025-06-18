import SiteHeader from "@/components/SiteHeader";
import AllowedUsers from "@/components/tables/AllowedUsers";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div>
      <div>
        <SiteHeader heading="Settings" />
      </div>
      <main className="mt-4 max-w-[50rem] m-auto">
        <AllowedUsers />
      </main>
    </div>
  );
}
