import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users?id=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          favorites: { include: { car: true } },
          inquiries: { include: { car: true } },
          purchases: { include: { car: true } },
        },
      });
      return NextResponse.json({ success: true, data: user });
    }

    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      return NextResponse.json({ success: true, data: user });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Users Error:", error);
    return NextResponse.json(
      { success: false, error: "회원 정보를 불러올 수 없어요" },
      { status: 500 }
    );
  }
}

// POST /api/users — 회원 가입
export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, provider } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "이메일과 이름은 필수예요" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const user = await prisma.user.create({
      data: { email, name, phone, provider: provider || "email" },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("User Create Error:", error);
    return NextResponse.json(
      { success: false, error: "회원 가입에 실패했어요" },
      { status: 500 }
    );
  }
}
