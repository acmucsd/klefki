import { NextRequest, NextResponse } from "next/server";
import { upload } from "@/util/board";
import { verifyAuthApp } from "@/util";
import { headers } from "next/headers";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST request to upload a board photo to the S3 bucket
 */
export async function POST(req: NextRequest) {
    try {
      await verifyAuthApp(headers());
    } catch (err: any) {
      return NextResponse.json({ error: err }, {status: 400});
    }

  const form = await req.formData();
  const file = form.get('file') as File;
  const url = await upload(file);

  return NextResponse.json({ url: url }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}