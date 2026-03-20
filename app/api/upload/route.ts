import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "fixcar";

    if (!cloudName) {
      return NextResponse.json({ error: "Cloudinary 설정이 안 되어 있습니다" }, { status: 500 });
    }

    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudForm,
    });

    const data = await res.json();
    if (data.secure_url) {
      return NextResponse.json({ success: true, url: data.secure_url });
    }
    return NextResponse.json({ error: "업로드 실패", detail: data.error?.message || "" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: "업로드 실패", detail: String(e) }, { status: 500 });
  }
}
