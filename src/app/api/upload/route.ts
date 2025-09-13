import { isUserAdmin, uploadScreenshotsUrls } from "@/db/queries";
import { verifyUser } from "@/lib/dal";
import { ScreenshotImageSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { genPathName } from "@/lib/utils";
import { revalidatePath } from "next/cache";
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

    const filePath = genPathName("shot", tradeId, file);

    try {
      await supabase.storage.from("screenshots").upload(filePath, file);

    } catch {
      return NextResponse.json({ error: "Error on upload image" }, { status: 502 });
    }

    /* Save the urls in the database */
    try {
      await uploadScreenshotsUrls(tradeId, filePath);
    } catch(error) {
      console.log("DB: ", error);
      return NextResponse.json({ error: "Error on upload url to db" }, { status: 500 })
    }
  })

  revalidatePath("/trades");
  return NextResponse.json({ revalidate: true }, { status: 200 });
}

