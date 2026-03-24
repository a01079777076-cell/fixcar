import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: "로그인 필요" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "파일을 선택해주세요" }, { status: 400 });

    /* 파일 크기 제한 (10MB) */
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다" }, { status: 400 });

    /* Cloudinary 업로드 */
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary 설정이 필요합니다 (환경변수 확인)" }, { status: 500 });
    }

    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", uploadPreset);
    cloudFormData.append("folder", "fixcar");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudFormData,
    });
    const data = await res.json();

    if (data.secure_url) {
      return NextResponse.json({ success: true, url: data.secure_url });
    }
    return NextResponse.json({ error: "업로드 실패", detail: data.error?.message }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: "업로드 중 오류", detail: String(e) }, { status: 500 });
  }
}
