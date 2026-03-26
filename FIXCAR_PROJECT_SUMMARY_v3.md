# 픽스카 FIXCAR — 프로젝트 전체 요약 v3
### 최종 업데이트: 2026-03-26
### 이 문서를 새 Claude 세션 첫 메시지에 붙여넣으면 프로젝트를 이어갈 수 있습니다

---

## 📌 프로젝트 개요

- **서비스명:** 픽스카 FIXCAR (fixcar.kr)
- **핵심 컨셉:** 광주 지역 중고차 정찰제(FIX 가격) 플랫폼
- **대상:** 광주/전남 중고차 구매자 + 딜러 (장기 전국 확장)
- **경쟁사:** 몰던카(moldeoncar.com) — 2003년부터 운영, ~1800 딜러, 정체 중
- **차별점:** FIX 정찰가, AI MBTI 추천, 허위매물 ZERO, 카탈로그 236대 배틀, 중고차 검수 인증
- **개발자:** 후니 (1996년생, 광주, 단독 개발)

## 🔧 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트 | Next.js 16.1.6 (App Router) + TypeScript |
| 스타일 | 인라인 CSS (Tailwind 미사용) |
| 폰트 | NanumSquareRound + Bebas Neue + Black Han Sans |
| DB | Railway PostgreSQL + Prisma 5.22.0 |
| 인증 | 자체 JWT (jose) + 카카오 OAuth |
| 결제 | PortOne V2 (카카오페이 + 토스) |
| 이미지 | Cloudinary |
| 배포 | Vercel |
| 보안 | proxy.ts(Next.js 16), rate-limit, api-guard |

## 📁 프로젝트 경로

- GitHub: https://github.com/a01079777076-cell/fixcar.git
- 로컬: C:\Users\USER\Desktop\fixcar
- 에러 로그: C:\Users\USER\Desktop\fixcar\FIXCAR_ERROR_LOG.md
- 프로젝트 요약: C:\Users\USER\Desktop\fixcar\FIXCAR_PROJECT_SUMMARY_v3.md

## 🎨 디자인 시스템

배경 #F0EEE9 / 포인트(PICK) #FF3B1E / 딜러(FIX) #0066FF / 성공 #2D8A52 / 경고 #E8A020

---

## ✅ 완성된 페이지 (~45+개)

**메인/공통:** / (메인), /login, /mypage, /settings, /notifications, /alerts, /contact, /terms, /privacy

**차량:** /cars (필터+찜+정렬5종+할부계산기), /cars/[id] (갤러리+찜+문의+공유+딜러카드+인증배지), /compare (4대비교+카카오/링크 공유), /price (시세그래프), /catalog (759모델), /ranking (6카테고리)

**콘텐츠:** /battle (236대 랜덤32강+순위표탭), /mbti (15문항), /blog (CRUD+대표글+SEO), /community (DC스타일+닉네임+좋아요+수정+신고모달7카테고리), /auction (커밍순), /clean (신고)

**서비스:** /inspection (검수서비스 3플랜+인증업체), /agent (개인거래대행 15~20만), /sell (내차팔기 역경매), /events (이벤트 진행중/종료), /notice (공지사항 고정/일반), /complexes (매매단지 4개소개), /shops (매매상사 검색+정렬)

**딜러:** /dealer (대시보드+수정), /dealer/cars/new (v6 연료별트림분리+사진SVG가이드), /dealer/cars/[id]/edit, /dealer/inquiries, /dealer/apply

**관리자:** /admin (매물상세모달+반려사유+문의답변+회원관리+방문자30일그래프)

**기타:** /shops/[id], /quiz-select, 404, global-error

## ✅ 완성된 API (~30+개)

**인증:** login, signup, check-id, phone-verify, kakao, kakao/callback, session, logout, find-id, find-pw
**차량:** cars(GET), cars/[id], dealer/cars(POST), dealer/cars/[id](PATCH), favorites(GET/POST/DELETE), favorites/list, inquiries(GET/POST), dealer/inquiries(GET/PATCH)
**관리자:** admin/cars, admin/inquiries, admin/users, admin/stats
**콘텐츠:** community(CRUD+like+comments), community/report(POST), blog(CRUD+views), battle(vote+rankings), events(GET), notice(GET), shops(GET), reviews(GET/POST)
**기타:** stats/activity, stats/dau, stats/visit, user/nickname, user/password, user/delete, alerts, notifications, dealers/ranking, shops/[id], upload, sitemap

## 📊 Prisma 주요 모델

User(nickname,nicknameChangedAt) / Dealer(shopDesc,shopPhone,shopAddr,complexName) / Car(status:AVAILABLE|REVIEWING|SOLD|RESERVED) / Favorite / Inquiry(PENDING|REPLIED) / BlogPost / CommunityPost(likes) / CommunityComment / CommunityReport(category,reason) / Notice(pinned) / Event(startDate,endDate,active) / DealerReview(rating,content) / VisitorLog / UserMbti / WishAlert / CarScore / CatalogReport / Purchase

## 🧩 주요 컴포넌트

Navbar(메가메뉴: 매물/카탈로그/커뮤니티/블로그 + 전체▾) / BottomTabBar / Providers(Auth+Visitor+Footer) / AuthProvider(30초캐싱) / FaqChatbot(플로팅+8개FAQ+키워드매칭) / DailyCounter / HomeCarousel / HomeBlogSection / HomeDealerRanking / HomeRecommendCars / BlogEditor / BlogContent(XSS방지) / ShareButtons / RecentCars / Footer(법적정보+면책문구+호스팅) / WelcomePopup / VisitorTracker / Skeleton / PhotoGuideSvg(4각도)

## 📦 데이터

data/catalog_data.ts (v4): BRAND_MODELS + CAR_SPECS + CAR_GRADES — 국산6+수입12 = 759모델
data/car_mbti_data.ts (v3): 15문항(DC4+SL3+EP4+HT4) × 16유형
prisma/seed.js: 테스트 데이터 (14유저+5딜러+16매물+8문의+5블로그+7커뮤+4공지+2이벤트+30일방문자+7리뷰+1신고)

---

## 🚧 다음 세션에서 할 것

### 🔴 즉시 작업
| # | 항목 | 설명 |
|---|------|------|
| 1 | 검색 자동완성 | 매물 검색 시 차명/브랜드 자동완성 드롭다운 |
| 2 | 매물 조회수 표시 | 리스트/그리드에 조회수 노출 |
| 3 | 유사 매물 추천 | 상세 페이지 하단 "이 차와 비슷한 매물" |
| 4 | 상태 라벨 자동화 | 신규등록(3일이내), 급매, 시세이하 자동 태그 |
| 5 | 페이지별 SEO 메타태그 | 각 페이지 title/description 동적 생성 |
| 6 | og:image | 매물별/페이지별 동적 OG 이미지 |
| 7 | 딜러 뱃지 시스템 | 판매왕/응답왕/신규딜러 등 |
| 8 | 광고 배너 시스템 | 딜러 유료 배너 |

### 🟡 사업자 등록 후
| # | 항목 |
|---|------|
| 9 | Footer 실제 사업자정보 입력 (현재 OOO 플레이스홀더) |
| 10 | 통신판매업 신고번호 + 공정위 사업자정보확인 링크 |
| 11 | SMS 실제 연동 (NHN Cloud) |
| 12 | 국토교통부 API (차량번호 조회) |
| 13 | PortOne 실제 결제 테스트 |
| 14 | robots.txt 오픈 (index:true) |
| 15 | 이용약관/개인정보처리방침 법률 검토 후 보강 |
| 16 | 환불/청약철회 정책 페이지 (/refund-policy) |

### 🟢 추후 개선
| # | 항목 |
|---|------|
| 17 | 모바일 반응형 (스마트폰 375~430px + 폴드 600~900px + 태블릿) |
| 18 | 성능 최적화 (ISR, next/image, 코드 스플릿) |
| 19 | PWA → 네이티브 앱 |
| 20 | 검색 자동완성 고도화 |
| 21 | 카카오톡 알림 연동 |
| 22 | JSON-LD 매물별 구조화 데이터 |
| 23 | 접근성(a11y) 개선 |

## 📋 사업 관련

- 상표권 신청 진행 중
- 사업자 등록 예정 (기존 휴대폰 매장 주소 사용, 전대차 계약 중)
- 업태: 정보통신업+서비스업 / 종목: 온라인정보제공업+통신판매업+중고자동차매매중개업+광고대행업
- 법인 설립 추천 (기존 사업 연매출 4억 + 세율 분리, 정부지원금 유리)
- 딜러 모집: 직접 방문 + 온라인(전화/문자/카톡/당근) 병행, 20개 한정 6개월 무료
- 대표번호: 사업자등록 후 1599-XXXX 또는 062-XXX-XXXX 개설 예정
- 정부 지원: 초기창업패키지, 예비창업패키지 (광주창조경제혁신센터)
- 검수 사업 모델: 계약금 1만(픽스카수수료) + 현장 14만(업체) / 4개월 무료 광고 / 북구부터 시작

---

## ⚠️ 에러 예방 규칙 (FIXCAR_ERROR_LOG.md)

1. as const 배열 → 모든 객체 동일 키
2. 새 유틸 생성 → 기존 import grep 확인
3. proxy.ts → export function proxy
4. 부분 수정 X → 전체 파일 재전달
5. API 응답 → {success, data} 통일
6. 서버/클라이언트 컴포넌트 분리
7. BottomTabBar → .fixcar-bottom-tab (nav[style] 금지)
8. 파일 전달 전 괄호 카운트 검증

## 👤 작업 규칙

- 파일 전달 시: 저장 경로표 + PowerShell git 명령어 (줄바꿈, && 사용 금지)
- 빌드 에러: 전체 파일 재전달 (부분 수정 안내 X)
- 코드 작성 전: 관련 기존 파일 먼저 요청 (추측 금지)
- 이미 보낸 파일: 다시 달라고 하지 않기
- 에러 발생 시: FIXCAR_ERROR_LOG.md에 ERR-XXX로 기록
- 다운로드 경로: C:\Users\USER\Downloads\files\
