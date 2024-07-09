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
 * 
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File;
  console.log(file);
  const url = await upload(file);

  try {
    await verifyAuthApp(headers());
  } catch (err: any) {
    return NextResponse.json({ error: err }, {status: 400});
  }

  return NextResponse.json({ url: url }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}