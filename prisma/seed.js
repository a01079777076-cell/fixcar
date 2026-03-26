const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 픽스카 시드 데이터 생성 시작...\n");

  /* ═══════════════════════════════════════
     1. 유저 (관리자 + 딜러 + 일반)
     ═══════════════════════════════════════ */
  const pw = await bcrypt.hash("test1234", 10);

  const admin = await prisma.user.create({
    data: { email: "admin@fixcar.kr", name: "관리자", nickname: "픽스카관리자", role: "ADMIN", password: pw, provider: "email", phone: "010-0000-0000" },
  });

  const dealerUsers = [];
  const dealerInfos = [
    { email: "dealer1@fixcar.kr", name: "김상사", nickname: "신뢰자동차김사장", phone: "010-1111-1111", shop: "신뢰자동차", addr: "광주 광산구 첨단중앙로 123", complex: "첨단 자동차매매단지", desc: "20년 경력, 국산차 전문", shopPhone: "062-111-1111" },
    { email: "dealer2@fixcar.kr", name: "박딜러", nickname: "광주모터스박대표", phone: "010-2222-2222", shop: "광주모터스", addr: "광주 북구 용봉로 456", complex: "광주 종합자동차매매시장", desc: "수입차/국산차 종합, 할부 상담 전문", shopPhone: "062-222-2222" },
    { email: "dealer3@fixcar.kr", name: "이대표", nickname: "베스트카이대표", phone: "010-3333-3333", shop: "베스트카", addr: "광주 광산구 하남대로 789", complex: "하남 자동차매매단지", desc: "실용적인 가격대 중고차 전문", shopPhone: "062-333-3333" },
    { email: "dealer4@fixcar.kr", name: "최사장", nickname: "드림오토최사장", phone: "010-4444-4444", shop: "드림오토", addr: "광주 남구 봉선로 321", complex: "남구 자동차거래센터", desc: "개인 맞춤형 상담, 탁송 서비스", shopPhone: "062-444-4444" },
    { email: "dealer5@fixcar.kr", name: "정대리", nickname: "에이스카정대리", phone: "010-5555-5555", shop: "에이스카", addr: "광주 서구 상무대로 555", complex: null, desc: "젊은 감각의 중고차 전문점", shopPhone: "062-555-5555" },
  ];

  for (const d of dealerInfos) {
    const u = await prisma.user.create({
      data: { email: d.email, name: d.name, nickname: d.nickname, role: "DEALER", password: pw, provider: "email", phone: d.phone },
    });
    dealerUsers.push(u);
  }

  const normalUsers = [];
  const normalInfos = [
    { email: "user1@test.com", name: "홍길동", nickname: "길동이" },
    { email: "user2@test.com", name: "김철수", nickname: "광주차덕후" },
    { email: "user3@test.com", name: "이영희", nickname: "영희맘" },
    { email: "user4@test.com", name: "박지민", nickname: "지민드라이브" },
    { email: "user5@test.com", name: "최수현", nickname: "수현짱" },
    { email: "user6@test.com", name: "정우진", nickname: "우진모터" },
    { email: "user7@test.com", name: "강미나", nickname: "미나미나" },
    { email: "user8@test.com", name: "윤서준", nickname: "서준아빠" },
  ];

  for (const u of normalInfos) {
    const user = await prisma.user.create({
      data: { email: u.email, name: u.name, nickname: u.nickname, role: "USER", password: pw, provider: "email" },
    });
    normalUsers.push(user);
  }

  console.log(`✅ 유저 ${1 + dealerUsers.length + normalUsers.length}명 생성`);

  /* ═══════════════════════════════════════
     2. 딜러 상사
     ═══════════════════════════════════════ */
  const dealers = [];
  for (let i = 0; i < dealerInfos.length; i++) {
    const d = await prisma.dealer.create({
      data: {
        userId: dealerUsers[i].id, shopName: dealerInfos[i].shop, shopAddr: dealerInfos[i].addr,
        complexName: dealerInfos[i].complex, shopDesc: dealerInfos[i].desc, shopPhone: dealerInfos[i].shopPhone,
        rating: [4.8, 4.5, 4.3, 4.7, 4.1][i], dealCount: [156, 89, 67, 134, 45][i],
        verified: i < 4,
      },
    });
    dealers.push(d);
  }
  console.log(`✅ 딜러 ${dealers.length}개 생성`);

  /* ═══════════════════════════════════════
     3. 차량 매물 (다양한 상태)
     ═══════════════════════════════════════ */
  const carsData = [
    // AVAILABLE
    { dealerIdx: 0, name: "아반떼 CN7 인스퍼레이션", brand: "현대", year: 2023, mileage: 18000, fuel: "가솔린", color: "흰색", price: 2150, cc: 1598, status: "AVAILABLE", tags: ["무사고", "1인소유", "정찰가"], options: ["스마트키", "후방카메라", "LED헤드램프", "카플레이/AA"] },
    { dealerIdx: 0, name: "쏘나타 DN8 프리미엄", brand: "현대", year: 2022, mileage: 32000, fuel: "하이브리드", color: "검정", price: 2680, cc: 1999, status: "AVAILABLE", tags: ["무사고", "하이브리드"], options: ["통풍시트", "전동시트", "어라운드뷰", "어댑티브크루즈"] },
    { dealerIdx: 1, name: "K5 DL3 시그니처", brand: "기아", year: 2023, mileage: 15000, fuel: "가솔린", color: "회색", price: 2490, cc: 1598, status: "AVAILABLE", tags: ["무사고", "신차급"], options: ["파노라마선루프", "JBL/하만카돈/BOSE", "헤드업디스플레이"] },
    { dealerIdx: 1, name: "스포티지 NQ5 프레스티지", brand: "기아", year: 2024, mileage: 8000, fuel: "디젤", color: "파랑", price: 3280, cc: 1998, status: "AVAILABLE", tags: ["무사고", "거의신차"], options: ["AWD(사륜)", "열선시트", "파워트렁크", "사각지대감지"] },
    { dealerIdx: 2, name: "투싼 NX4 하이브리드", brand: "현대", year: 2023, mileage: 25000, fuel: "하이브리드", color: "은색", price: 2950, cc: 1598, status: "AVAILABLE", tags: ["무사고", "하이브리드", "1인소유"], options: ["스마트키", "후방카메라", "차선이탈경보"] },
    { dealerIdx: 2, name: "레이", brand: "기아", year: 2022, mileage: 42000, fuel: "가솔린", color: "노랑", price: 1180, cc: 998, status: "AVAILABLE", tags: ["경차", "여성소유"], options: ["블루투스", "USB충전"] },
    { dealerIdx: 3, name: "그랜저 GN7 캘리그래피", brand: "현대", year: 2024, mileage: 5000, fuel: "하이브리드", color: "검정", price: 4850, cc: 1598, status: "AVAILABLE", tags: ["무사고", "풀옵션", "VIP"], options: ["에어서스펜션", "통풍시트", "전동시트", "헤드업디스플레이", "어라운드뷰", "파노라마선루프"] },
    { dealerIdx: 3, name: "BMW 520i M스포츠", brand: "BMW", year: 2022, mileage: 35000, fuel: "가솔린", color: "흰색", price: 4200, cc: 1998, status: "AVAILABLE", tags: ["수입차", "M스포츠"], options: ["LED헤드램프", "패들시프트", "무선충전"] },
    { dealerIdx: 4, name: "벤츠 E300 아방가르드", brand: "벤츠", year: 2021, mileage: 48000, fuel: "가솔린", color: "은색", price: 4580, cc: 1991, status: "AVAILABLE", tags: ["수입차", "무사고"], options: ["통풍시트", "전동시트", "어라운드뷰", "파워트렁크"] },
    { dealerIdx: 4, name: "아이오닉5 롱레인지", brand: "현대", year: 2023, mileage: 20000, fuel: "전기", color: "회색", price: 3650, cc: 0, status: "AVAILABLE", tags: ["전기차", "보조금대상"], options: ["V2L", "AWD(사륜)", "어댑티브크루즈"] },

    // REVIEWING (승인 대기)
    { dealerIdx: 0, name: "싼타페 MX5 디젤 프리미엄", brand: "현대", year: 2024, mileage: 3000, fuel: "디젤", color: "갈색", price: 3800, cc: 2199, status: "REVIEWING", tags: ["무사고"], options: ["AWD(사륜)", "열선시트"] },
    { dealerIdx: 1, name: "모하비 마스터즈", brand: "기아", year: 2022, mileage: 55000, fuel: "디젤", color: "검정", price: 3950, cc: 2999, status: "REVIEWING", tags: ["대형SUV"], options: ["에어서스펜션", "후석모니터"] },
    { dealerIdx: 2, name: "카니발 KA4 시그니처", brand: "기아", year: 2023, mileage: 22000, fuel: "디젤", color: "흰색", price: 3600, cc: 2199, status: "REVIEWING", tags: ["무사고", "9인승"], options: ["전동시트", "파워슬라이딩도어"] },

    // SOLD (판매 완료)
    { dealerIdx: 0, name: "코나 2세대 프리미엄", brand: "현대", year: 2023, mileage: 12000, fuel: "가솔린", color: "빨강", price: 2380, cc: 1598, status: "SOLD", tags: ["무사고"], options: ["후방카메라", "스마트키"] },
    { dealerIdx: 3, name: "셀토스 프레스티지", brand: "기아", year: 2022, mileage: 28000, fuel: "가솔린", color: "초록", price: 2050, cc: 1598, status: "SOLD", tags: ["무사고", "1인소유"], options: ["LED헤드램프", "블루투스"] },

    // RESERVED (예약 중)
    { dealerIdx: 1, name: "테슬라 모델3 롱레인지", brand: "테슬라", year: 2023, mileage: 15000, fuel: "전기", color: "흰색", price: 4100, cc: 0, status: "RESERVED", tags: ["전기차", "오토파일럿"], options: ["오토파일럿", "프리미엄오디오"] },
  ];

  const cars = [];
  for (const c of carsData) {
    const car = await prisma.car.create({
      data: {
        dealerId: dealers[c.dealerIdx].id, name: c.name, brand: c.brand, year: c.year,
        mileage: c.mileage, fuel: c.fuel, color: c.color, price: c.price, cc: c.cc,
        region: "광주", transmission: "자동", owners: 1, accident: false,
        status: c.status, tags: c.tags, options: c.options, images: [],
      },
    });
    cars.push(car);
  }
  console.log(`✅ 매물 ${cars.length}대 생성 (판매중 ${carsData.filter(c => c.status === "AVAILABLE").length} / 승인대기 ${carsData.filter(c => c.status === "REVIEWING").length} / 판매완료 ${carsData.filter(c => c.status === "SOLD").length} / 예약중 ${carsData.filter(c => c.status === "RESERVED").length})`);

  /* ═══════════════════════════════════════
     4. 찜 (Favorites)
     ═══════════════════════════════════════ */
  const availableCars = cars.filter((_, i) => carsData[i].status === "AVAILABLE");
  for (let i = 0; i < normalUsers.length && i < availableCars.length; i++) {
    await prisma.favorite.create({ data: { userId: normalUsers[i].id, carId: availableCars[i].id } });
  }
  console.log(`✅ 찜 ${Math.min(normalUsers.length, availableCars.length)}개 생성`);

  /* ═══════════════════════════════════════
     5. 문의 (다양한 상태)
     ═══════════════════════════════════════ */
  const inquiriesData = [
    { userIdx: 0, carIdx: 0, msg: "안녕하세요! 아반떼 시승 가능한가요? 주말에 방문하고 싶습니다.", reply: "안녕하세요! 물론입니다. 토요일 오전에 방문해주시면 시승 도와드리겠습니다.", status: "REPLIED" },
    { userIdx: 1, carIdx: 1, msg: "쏘나타 하이브리드 할부 조건이 어떻게 되나요? 36개월 기준으로 알려주세요.", reply: "36개월 기준 월 약 58만원입니다. 금리는 신용등급에 따라 4.9~8.9% 적용됩니다.", status: "REPLIED" },
    { userIdx: 2, carIdx: 2, msg: "K5 실물 색상이 궁금합니다. 사진 추가로 보내주실 수 있나요?", reply: null, status: "PENDING" },
    { userIdx: 3, carIdx: 3, msg: "스포티지 디젤 연비가 실제로 어느 정도 나오나요?", reply: null, status: "PENDING" },
    { userIdx: 4, carIdx: 6, msg: "그랜저 캘리그래피 가격 네고 가능한가요?", reply: "죄송합니다. FIX 정찰가 제도라 추가 할인은 어렵습니다. 대신 풀옵션에 거의 신차 컨디션입니다!", status: "REPLIED" },
    { userIdx: 5, carIdx: 7, msg: "BMW 520i 보험 이력 확인 가능한가요? 사고 여부가 궁금합니다.", reply: null, status: "PENDING" },
    { userIdx: 6, carIdx: 9, msg: "아이오닉5 보조금 적용 가능한가요? 실구매가가 어떻게 되나요?", reply: "현재 보조금 대상 차량이지만, 중고차는 보조금 적용이 안 됩니다. 다만 가격이 매우 합리적입니다!", status: "REPLIED" },
    { userIdx: 7, carIdx: 4, msg: "투싼 하이브리드 타이어 상태는 어떤가요?", reply: null, status: "PENDING" },
  ];

  for (const inq of inquiriesData) {
    await prisma.inquiry.create({
      data: {
        userId: normalUsers[inq.userIdx].id, carId: cars[inq.carIdx].id,
        message: inq.msg, reply: inq.reply, status: inq.status,
      },
    });
  }
  console.log(`✅ 문의 ${inquiriesData.length}개 생성 (답변완료 ${inquiriesData.filter(i => i.status === "REPLIED").length} / 대기 ${inquiriesData.filter(i => i.status === "PENDING").length})`);

  /* ═══════════════════════════════════════
     6. 블로그
     ═══════════════════════════════════════ */
  const blogData = [
    { title: "중고차 구매 전 반드시 확인해야 할 5가지", summary: "첫 중고차 구매자를 위한 필수 체크리스트", category: "구매 가이드", content: "<h2>1. 성능상태점검기록부 확인</h2><p>중고차를 구매할 때 가장 먼저 확인해야 할 것은 성능상태점검기록부입니다. 이 서류는 차량의 주요 부품 상태와 사고 이력을 기록합니다.</p><h2>2. 보험개발원 이력 조회</h2><p>카히스토리를 통해 보험 사고 이력, 침수 여부, 소유자 변경 이력 등을 확인할 수 있습니다.</p><h2>3. 실물 확인</h2><p>반드시 직접 차량을 보고, 시운전을 해보세요. 엔진 소리, 변속 감각, 브레이크 상태 등을 꼼꼼히 체크합니다.</p><h2>4. 시세 비교</h2><p>여러 플랫폼의 시세를 비교하여 적정 가격인지 확인하세요. 픽스카 시세 조회 기능을 활용하면 편리합니다.</p><h2>5. 이전등록비 계산</h2><p>차량 가격 외에 취득세, 등록세, 공채, 보험료 등 추가 비용을 미리 계산해두세요.</p>" },
    { title: "2024~2025년 가장 인기 있는 중고차 TOP 10", summary: "광주 지역 거래량 기준 인기 모델 분석", category: "시장 분석", content: "<h2>1위: 현대 아반떼</h2><p>합리적인 가격과 뛰어난 연비로 꾸준한 인기를 유지하고 있습니다.</p><h2>2위: 기아 K5</h2><p>세련된 디자인과 넓은 실내공간으로 30~40대에게 인기입니다.</p><h2>3위: 현대 투싼</h2><p>SUV 수요 증가와 함께 하이브리드 모델이 특히 인기입니다.</p><h2>4위: 기아 스포티지</h2><p>실용적인 크기와 디젤 연비가 장점입니다.</p><h2>5위: 현대 쏘나타</h2><p>하이브리드 모델 중심으로 중고차 시장에서 강세입니다.</p>" },
    { title: "하이브리드 vs 디젤 vs 전기차, 나에게 맞는 연료는?", summary: "연료별 장단점 비교 분석", category: "구매 가이드", content: "<h2>하이브리드</h2><p>도심 연비가 우수하고 유지비가 저렴합니다. 단, 초기 구매가가 높은 편입니다.</p><h2>디젤</h2><p>장거리 주행이 많다면 디젤이 유리합니다. 토크가 높아 고속도로 주행이 편안합니다. 다만 DPF 관리에 주의가 필요합니다.</p><h2>전기차</h2><p>유지비가 가장 저렴하지만 충전 인프라를 고려해야 합니다. 2~3년 된 중고 전기차는 가성비가 뛰어납니다.</p>" },
    { title: "광주 중고차 매매단지 완벽 가이드", summary: "광주 지역 주요 매매단지별 특징과 방문 팁", category: "지역 정보", content: "<h2>첨단 자동차매매단지</h2><p>광주 최대 규모의 매매단지로, 국산/수입 다양한 차량을 보유하고 있습니다. 첨단지구에 위치하여 접근성이 좋습니다.</p><h2>광주 종합자동차매매시장</h2><p>북구에 위치한 전통 있는 매매시장입니다. 오랜 역사만큼 신뢰할 수 있는 딜러들이 많습니다.</p><h2>방문 팁</h2><p>평일 오전에 방문하면 여유롭게 상담받을 수 있습니다. 여러 곳을 비교하며 둘러보세요.</p>" },
    { title: "중고차 할부 vs 일시불, 어떤 게 유리할까?", summary: "금융 조건별 장단점 비교", category: "금융/보험", content: "<h2>일시불 구매</h2><p>총 비용이 가장 저렴합니다. 이자 부담이 없어 장기적으로 유리합니다.</p><h2>할부 구매</h2><p>초기 자금 부담을 줄일 수 있습니다. 12~60개월까지 선택 가능하며, 금리는 보통 4.9~8.9% 사이입니다.</p><h2>추천</h2><p>여유 자금이 있다면 일시불이 유리하지만, 투자 수익률이 할부 금리보다 높다면 할부도 합리적인 선택입니다.</p>" },
  ];

  for (const b of blogData) {
    await prisma.blogPost.create({
      data: { ...b, authorId: admin.id, published: true, tags: JSON.stringify(b.category === "구매 가이드" ? ["중고차", "구매팁"] : ["중고차", "시장분석"]) },
    });
  }
  console.log(`✅ 블로그 ${blogData.length}개 생성`);

  /* ═══════════════════════════════════════
     7. 커뮤니티 + 댓글
     ═══════════════════════════════════════ */
  const communityData = [
    { userIdx: 0, title: "첫 중고차 구매 후기 (아반떼 CN7)", content: "오늘 드디어 첫 차를 뽑았습니다!\n\n픽스카에서 아반떼 CN7 인스퍼레이션을 구매했는데, 정찰가라서 가격 흥정 스트레스가 전혀 없었어요.\n\n딜러분도 친절하셨고, 차 상태도 완벽했습니다.\n\n사진은 좀 더 타고 나서 올릴게요!", category: "차량 후기", views: 234, likes: 15 },
    { userIdx: 1, title: "광주에서 SUV 추천 부탁드립니다", content: "예산 3000만원 이하로 SUV를 알아보고 있습니다.\n\n가족이 4명이라 넉넉한 공간이 필요한데,\n투싼 vs 스포티지 vs 셀토스 중에서 뭐가 좋을까요?\n\n디젤이나 하이브리드 선호합니다.", category: "질문/답변", views: 189, likes: 8 },
    { userIdx: 2, title: "중고차 보험 가입 팁 공유", content: "중고차 보험 가입할 때 알아두면 좋은 팁 공유합니다.\n\n1. 다이렉트 보험이 대리점보다 20~30% 저렴\n2. 자차보험은 차량 가치에 따라 결정\n3. 운전경력이 길수록 보험료 할인\n4. 블랙박스 할인도 꼭 챙기세요\n\n다들 안전 운전하세요!", category: "정보 공유", views: 567, likes: 32 },
    { userIdx: 3, title: "주말 드라이브 코스 추천 (담양)", content: "지난 주말에 담양 메타세쿼이아길 다녀왔어요.\n\n광주에서 30분이면 가는데, 드라이브 코스로 최고입니다.\n메타프로방스도 구경하고, 떡갈비도 먹고 왔어요.\n\n다음엔 순천만 가볼 예정!", category: "자유게시판", views: 412, likes: 25 },
    { userIdx: 4, title: "전기차 충전 광주 어디서 하세요?", content: "아이오닉5 타고 있는데 광주에서 급속충전기 어디가 좋나요?\n\n집에서 완속 충전하긴 하는데, 외출할 때 급속 충전 필요할 때가 있어서요.\n\n추천 장소 부탁드립니다!", category: "질문/답변", views: 145, likes: 6 },
    { userIdx: 5, title: "셀프세차 초보 질문", content: "처음으로 셀프세차를 해보려고 하는데요.\n\n필요한 용품이랑 순서를 알려주시면 감사하겠습니다.\n\n유튜브 봐도 너무 많아서 기본적인 것만 알려주세요!", category: "질문/답변", views: 298, likes: 12 },
    { userIdx: 6, title: "광주 중고차 동호회 만들까 합니다", content: "광주에서 중고차 관련 동호회를 만들어볼까 합니다.\n\n정기 모임, 정보 공유, 드라이브 등을 함께 하면 좋겠어요.\n\n관심 있으신 분 댓글 남겨주세요!", category: "모임/동호회", views: 189, likes: 18 },
  ];

  const communityPosts = [];
  for (const c of communityData) {
    const post = await prisma.communityPost.create({
      data: { title: c.title, content: c.content, category: c.category, views: c.views, likes: c.likes, authorId: normalUsers[c.userIdx].id },
    });
    communityPosts.push(post);
  }

  /* 댓글 */
  const comments = [
    { postIdx: 0, userIdx: 1, content: "축하드립니다! 아반떼 좋은 선택이에요 👍" },
    { postIdx: 0, userIdx: 2, content: "저도 픽스카에서 샀는데 만족합니다!" },
    { postIdx: 1, userIdx: 3, content: "투싼 하이브리드 추천합니다. 연비도 좋고 공간도 넉넉해요." },
    { postIdx: 1, userIdx: 5, content: "스포티지 디젤도 괜찮아요. 장거리 주행 많으시면 디젤이 나을 수도" },
    { postIdx: 2, userIdx: 0, content: "좋은 정보 감사합니다! 블랙박스 할인은 몰랐네요" },
    { postIdx: 3, userIdx: 6, content: "메타세쿼이아길 저도 좋아해요! 가을에 또 가야겠다" },
    { postIdx: 4, userIdx: 7, content: "이마트 충전기 괜찮아요. 쇼핑하면서 충전하면 딱!" },
    { postIdx: 6, userIdx: 0, content: "관심있습니다! 카카오톡 오픈채팅 만들어주세요" },
    { postIdx: 6, userIdx: 4, content: "저도 참여하고 싶어요!" },
  ];

  for (const c of comments) {
    await prisma.communityComment.create({
      data: { postId: communityPosts[c.postIdx].id, authorId: normalUsers[c.userIdx].id, content: c.content },
    });
  }
  console.log(`✅ 커뮤니티 ${communityPosts.length}개 + 댓글 ${comments.length}개 생성`);

  /* ═══════════════════════════════════════
     8. 공지사항
     ═══════════════════════════════════════ */
  const notices = [
    { title: "📢 픽스카 서비스 오픈 안내", content: "안녕하세요, 픽스카입니다.\n\n광주 지역 중고차 정찰제 플랫폼 '픽스카'가 정식 오픈하였습니다.\n\n✅ 정찰가(FIX) 제도로 가격 흥정 없이 투명한 거래\n✅ 허위매물 ZERO를 위한 다중 검증 시스템\n✅ 광주/전남 딜러 직접 방문 확인\n\n많은 이용 부탁드립니다!", pinned: true },
    { title: "딜러 회원 모집 안내 (6개월 무료)", content: "픽스카에서 광주 지역 딜러 회원을 모집합니다.\n\n📌 모집 조건:\n- 광주/전남 소재 중고차 매매상사\n- 사업자등록증 + 종사원증 보유\n\n📌 혜택:\n- 6개월 등록비 무료\n- 프리미엄 슬롯 3개 무료 제공\n- 20개 딜러 한정 선착순", pinned: true },
    { title: "개인정보처리방침 업데이트 안내", content: "2026년 3월 25일부로 개인정보처리방침이 업데이트됩니다.\n\n주요 변경사항:\n- 수집 항목 명확화\n- 보관 기간 구체화", pinned: false },
    { title: "시스템 점검 안내 (3/28 새벽)", content: "서비스 안정화를 위한 시스템 점검이 예정되어 있습니다.\n\n📅 일시: 2026년 3월 28일(토) 02:00 ~ 06:00\n⏱️ 소요시간: 약 4시간", pinned: false },
  ];

  for (const n of notices) {
    await prisma.notice.create({ data: n });
  }
  console.log(`✅ 공지사항 ${notices.length}개 생성`);

  /* ═══════════════════════════════════════
     9. 이벤트
     ═══════════════════════════════════════ */
  const events = [
    { title: "🎉 픽스카 오픈 기념 이벤트", content: "첫 매물 등록 딜러에게 프리미엄 슬롯 3개월 무료 제공!\n\n참여: 딜러 회원가입 → 매물 1대 이상 등록", startDate: new Date("2026-03-01"), endDate: new Date("2026-06-30"), active: true },
    { title: "🚗 중고차 시승 후기 이벤트", content: "픽스카 거래 완료 후 시승 후기를 커뮤니티에 작성하면 추첨으로 주유 상품권 5만원!", startDate: new Date("2026-04-01"), endDate: new Date("2026-05-31"), active: true },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log(`✅ 이벤트 ${events.length}개 생성`);

  /* ═══════════════════════════════════════
     10. 방문자 로그 (30일)
     ═══════════════════════════════════════ */
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = Math.floor(Math.random() * 80) + 20;
    for (let j = 0; j < count; j++) {
      await prisma.visitorLog.create({
        data: { ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, date: dateStr, userAgent: "Mozilla/5.0", referer: "" },
      });
    }
  }
  console.log(`✅ 방문자 로그 30일치 생성`);

  /* ═══════════════════════════════════════
     11. 딜러 리뷰
     ═══════════════════════════════════════ */
  const reviewsData = [
    { dealerIdx: 0, userIdx: 0, rating: 5, content: "친절하고 차 상태도 완벽했습니다. 강추!" },
    { dealerIdx: 0, userIdx: 1, rating: 5, content: "정찰가 시스템이 마음에 들었어요. 스트레스 없이 거래했습니다." },
    { dealerIdx: 1, userIdx: 2, rating: 4, content: "상담이 꼼꼼하셨어요. 할부 조건도 잘 설명해주셨습니다." },
    { dealerIdx: 1, userIdx: 3, rating: 5, content: "K5 구매했는데 만족합니다! 서류 처리도 빠르셨어요." },
    { dealerIdx: 2, userIdx: 4, rating: 4, content: "레이 샀어요. 가격이 합리적이었습니다." },
    { dealerIdx: 3, userIdx: 5, rating: 5, content: "그랜저 풀옵션 정말 좋아요. 딜러분 최고!" },
    { dealerIdx: 3, userIdx: 6, rating: 4, content: "BMW 상담 잘 받았습니다. 수입차 지식이 풍부하시네요." },
  ];

  for (const r of reviewsData) {
    await prisma.dealerReview.create({
      data: { dealerId: dealers[r.dealerIdx].id, userId: normalUsers[r.userIdx].id, rating: r.rating, content: r.content },
    });
  }
  console.log(`✅ 딜러 리뷰 ${reviewsData.length}개 생성`);

  /* ═══════════════════════════════════════
     12. 신고 (테스트)
     ═══════════════════════════════════════ */
  if (communityPosts.length > 0) {
    await prisma.communityReport.create({
      data: { postId: communityPosts[5].id, userId: normalUsers[7].id, category: "광고/홍보", reason: "셀프세차 용품 광고 의심", status: "PENDING" },
    });
    console.log(`✅ 신고 1건 생성`);
  }

  console.log("\n🎉 시드 완료! 모든 테스트 데이터가 생성되었습니다.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 관리자: admin@fixcar.kr / test1234");
  console.log("🏪 딜러: dealer1~5@fixcar.kr / test1234");
  console.log("👥 일반: user1~8@test.com / test1234");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(e => { console.error("❌ 시드 에러:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
