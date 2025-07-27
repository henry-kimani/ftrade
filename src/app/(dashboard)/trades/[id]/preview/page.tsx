import Metrics from "@/components/Metrics";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import Strategy from "@/components/strategy/Strategy";
import Notes from "@/components/notes/Notes";
import React, { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getScreenshotUrls } from "@/db/queries";
import { createClient } from "@/lib/supabase/server";

export default async function PreviewTrade(props: {
  params: Promise<{ id: string }>
}) {

  const { id: tradeId } = await props.params;

  const screenshots = await getScreenshotUrls(tradeId);
  const supabase = await createClient();

  const publicScreenshots = screenshots.map(({ screenshotId, screenshotUrl }) => {
    if (!screenshotUrl) return;

    const { data } = supabase.storage.from('screenshots').getPublicUrl(screenshotUrl);

    if (!data) return;

    return {
      screenshotId,
      screenshotPublicUrl: data.publicUrl,
      screenshotPath: screenshotUrl
    }
  });

  return (
    <div>
      <div>
        <SiteHeader heading="TRADE PREVIEW"/>
      </div>
      <main className="max-w-3xl m-auto p-4">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-lg">
              <BreadcrumbItem>
                <Link 
                  href="/trades"
                  className="transition-colors hover:text-foreground"
                >Trades</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid place-items-center mb-8">
          <ScreenshotCarousel screenshots={publicScreenshots} tradeId={tradeId} />
        </div>

        <div className="grid mb-4">
          <Suspense fallback="Loading Strategies...">
            <Strategy tradeId={tradeId}/>
          </Suspense>
        </div>

        <div className="mb-4">
          <Metrics tradeId={tradeId} />
        </div>

        <div>
          <Suspense fallback="Loading Notes ...">
            <Notes tradeId={tradeId} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
