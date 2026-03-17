import { NextRequest, NextResponse } from "next/server";

// 국토교통부 자동차 정보 조회 API
// data.go.kr에서 "자동차 정보 조회 서비스" API 키 발급 필요
// 환경변수: MOLIT_API_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const carNumber = searchParams.get("carNumber");

  if (!carNumber) {
    return NextResponse.json({ success: false, error: "차량번호를 입력해주세요" }, { status: 400 });
  }

  const apiKey = process.env.MOLIT_API_KEY;

  if (!apiKey) {
    // API 키 없을 때 — 임시 더미 데이터 반환 (개발용)
    return NextResponse.json({
      success: false,
      error: "차량 조회 API 키가 설정되지 않았어요. data.go.kr에서 API 키를 발급받아 MOLIT_API_KEY 환경변수에 등록해주세요.",
    });
  }

  try {
    // 국토교통부 자동차 정보 API 호출
    const url = `https://apis.data.go.kr/1613000/CarInfoInqireService2/getCarInfoInqire?serviceKey=${apiKey}&carNo=${encodeURIComponent(carNumber)}&_type=json`;

    const res = await fetch(url);
    const data = await res.json();

    const item = data?.response?.body?.items?.item;

    if (!item) {
      return NextResponse.json({ success: false, error: "차량 정보를 찾을 수 없어요" });
    }

    // 연료 타입 변환
    const fuelMap: Record<string, string> = {
      "휘발유": "가솔린",
      "경유": "디젤",
      "전기": "전기",
      "하이브리드": "하이브리드",
      "LPG": "LPG",
    };

    const result = {
      brand: item.mfr_nm || "",
      model: item.vhcl_nm || "",
      year: item.yr ? parseInt(item.yr) : null,
      fuel: fuelMap[item.fuel_knd] || item.fuel_knd || "가솔린",
      color: item.colr_nm || "",
      cc: item.dspl ? parseInt(item.dspl) : null,
      transmission: item.grbx_knd?.includes("자동") ? "자동" : item.grbx_knd?.includes("수동") ? "수동" : "자동",
      accident: false, // 보험개발원 API 별도 연동 필요
    };

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error("Car lookup error:", error);
    return NextResponse.json({ success: false, error: "조회 중 오류가 발생했어요" }, { status: 500 });
  }
}
