import SiteHeader from "@/components/SiteHeader";
import SyncToMt from "@/components/SyncToMT";

export default function SyncData() {
  return (
    <main>
      <div>
        <SiteHeader heading="sync data" />
      </div>
      <div className="max-w-4xl mx-auto p-4 mt-5">
        <SyncToMt />
      </div>
    </main>
  );
}
