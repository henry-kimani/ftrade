import SiteHeader from "@/components/SiteHeader";
import AllowedUsers from "@/components/tables/AllowedUsers";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div>
      <div>
        <SiteHeader heading="Settings" />
      </div>
      <main className="max-w-3xl m-auto p-4">
        <AllowedUsers />
      </main>
    </div>
  );
}
