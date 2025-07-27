import { isUserAdmin, uploadScreenshotsUrls } from "@/db/queries";
import { verifyUser } from "@/lib/dal";
import { ScreenshotImageSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { genPathName } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { user } = await verifyUser();
  const isAdmin = await isUserAdmin(user.id);

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();

  const validatedValues = ScreenshotImageSchema.safeParse({
    screenshots: formData.getAll("screenshots"),
    tradeId: formData.get("tradeId")
  });

  if (!validatedValues.success) {
    console.log("Some errors!", validatedValues.error.flatten().fieldErrors);
    return NextResponse.json(
      {
        error: validatedValues.error.flatten().fieldErrors,
      },
      {
        status: 400
      }
    );
  }

  /* Prepare data for upload */
  const supabase = await createClient();
  const { screenshots, tradeId } = validatedValues.data;

  screenshots.forEach(async(file) =>  {
    if (!file) return NextResponse.json({ error: "No file"}, { status: 400 });

    const filePath = genPathName("shot", tradeId, file)
    const {error} = await supabase.storage.from("screenshots").upload(filePath, file);

    if (error) {
      return NextResponse.json({ error: "Error on upload" }, { status: 502 });
    }

    /* Save the urls in the database */
    try {
      await uploadScreenshotsUrls(tradeId, filePath);
    } catch(error) {
      console.log("DB: ", error);
      return NextResponse.json({ error: "Error on upload to db" }, { status: 500 })
    }
  })

  return NextResponse.json({});
}

