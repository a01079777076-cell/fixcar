# CLAUDE.md — 픽스카 FIXCAR 프로젝트 하네스

## 프로젝트 개요

광주 지역 중고차 정찰제(FIX 가격) 플랫폼. Next.js 16 App Router 기반 풀스택 앱.
- 도메인: fixcar.kr
- 배포: Vercel
- DB: Railway PostgreSQL + Prisma 5.22
- 인증: 자체 JWT(jose) + 카카오 OAuth (next-auth 아님, 직접 구현)
- 결제: PortOne V2
- 이미지: Cloudinary
- 스타일: Tailwind CSS 4 + globals.css (인라인 style도 혼용)

## 기술 스택 버전

- Next.js 16.1.6 / React 19.2.3 / TypeScript 5
- Prisma 5.22.0 / @prisma/client 5.22.0
- Tailwind CSS 4 (PostCSS)
- lucide-react (아이콘)
- jose (JWT) / bcryptjs (비밀번호)

## 디렉토리 구조

```
app/                  # Next.js App Router 페이지 + API
  api/                # REST API 라우트 (~100+개)
  admin/              # 관리자 페이지
  dealer/             # 딜러 전용 페이지
  auth/               # 인증 관련 페이지
  cars/, blog/, community/, ...  # 고객 페이지
components/           # 공유 컴포넌트 (~39개)
lib/                  # 유틸리티 (auth, prisma, api-guard, rate-limit 등)
hooks/                # useAuth, useInfiniteScroll
data/                 # 정적 데이터 (catalog, mbti, tmi)
prisma/               # schema.prisma + seed
public/               # 정적 파일 (아이콘, manifest, sw.js)
```

## 핵심 패턴

### API 라우트
- `lib/api-guard.ts`의 `apiGuard(req, { auth, rateLimit })` 사용
- guard가 NextResponse를 반환하면 차단된 것 → 그대로 return
- 응답 형식: `{ success: true, data: ... }` 또는 `{ success: false, error: "..." }`

### 인증
- 쿠키명: `fixcar-token` (httpOnly, maxAge 7일)
- `lib/auth.ts`: signToken, decodeToken, getAuthUser, requireAuth, requireAdmin, requireDealer
- 역할: USER / DEALER / ADMIN
- 카카오 OAuth: `/api/auth/kakao` → `/api/auth/kakao/callback`

### 컴포넌트
- "use client" 지시어로 클라이언트/서버 분리
- `components/Providers.tsx`: Auth + Toast 컨텍스트 래퍼
- `hooks/useAuth.ts`: user, loading, isDealer, isAdmin 반환
- 레이아웃: Navbar(메가메뉴) + BottomTabBar(모바일) + Footer

### DB (Prisma)
- 주요 모델: User, Dealer, Car, BlogPost, CommunityPost, Favorite, Inquiry, Purchase, Notice, Event, DealerReview, VisitorLog 등 15+개
- Car.status: AVAILABLE | REVIEWING | SOLD | RESERVED
- `lib/prisma.ts`: 싱글턴 클라이언트
- 빌드 시 `prisma generate` 자동 실행

### 보안
- `next.config.ts`: CSP, HSTS, X-Frame-Options 등 보안 헤더
- `lib/rate-limit.ts`: 기본 60req/min
- `lib/sanitize.ts`, `lib/contentFilter.ts`: 입력 검증

## 작업 규칙

### 필수
- 코드 수정 전 반드시 해당 파일을 먼저 읽을 것
- API 응답은 `{ success, data }` 또는 `{ success, error }` 형식 유지
- 서버/클라이언트 컴포넌트 분리 준수
- `as const` 배열의 모든 객체는 동일 키 구조
- 새 유틸 만들기 전 기존 lib/ 파일 확인
- BottomTabBar 스타일: `.fixcar-bottom-tab` 클래스 사용 (nav[style] 금지)

### 금지
- .env 파일 커밋 금지
- `app/generated/prisma` 커밋 금지
- 부분 코드 스니펫 제공 금지 → 전체 파일 제공
- 추측으로 코드 작성 금지 → 기존 파일 먼저 확인

### 빌드 & 테스트
- `npm run dev`: 개발 서버
- `npm run build`: prisma generate + next build
- `npm run lint`: ESLint 실행
- TypeScript 빌드 에러 무시 안 함 (`ignoreBuildErrors: false`)

## 디자인 토큰

| 용도 | 색상 |
|------|------|
| 배경 | #F0EEE9 |
| 포인트(PICK) | #FF3B1E |
| 딜러(FIX) | #0066FF |
| 성공 | #2D8A52 |
| 경고 | #E8A020 |
| 테마 | #FF3B1E |

## 에러 대응

에러 발생 시 `FIXCAR_ERROR_LOG.md`에 ERR-XXX 형식으로 기록.
기존 에러 패턴은 해당 파일 참조.

## 외부 서비스 키 (환경변수)

- `DATABASE_URL`: Railway PostgreSQL
- `NEXTAUTH_SECRET`: JWT 서명
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`: 카카오 OAuth
- `NEXT_PUBLIC_GA_ID`: Google Analytics
- `NEXT_PUBLIC_KAKAO_JS_KEY`: 카카오 JS SDK
