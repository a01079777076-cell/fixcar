# 픽스카 FIXCAR — 에러 로그 & 예방 가이드
### 최종 업데이트: 2026-03-23
### 이 파일을 참고하여 동일한 실수를 반복하지 않는다

---

## 🔴 빌드 에러 (컴파일 타임)

### ERR-001: TypeScript `as const` 배열에서 선택적 속성 접근
- **에러:** `Property 'required' does not exist on type`
- **원인:** `PHOTO_SLOTS` 배열에서 일부 항목에만 `required` 속성이 있고 나머지엔 없음. `as const`로 선언하면 타입이 union으로 좁혀져서 공통 속성만 접근 가능
- **해결:** 모든 항목에 `required: false` 명시 추가
- **예방 규칙:** `as const` 배열의 객체는 모든 항목이 동일한 키를 가져야 함. 선택적 속성도 명시적으로 기본값 넣기

### ERR-002: 괄호 불일치 (Expected ',' got '<eof>')
- **에러:** `Parsing ecmascript source code failed — Expected ',', got '<eof>'`
- **원인:** 파일 수정 시 중괄호/소괄호 하나 빠지거나 추가됨
- **해결:** 파일 전체 괄호 카운트 후 불일치 위치 특정
- **예방 규칙:** 파일 수정 후 반드시 괄호 검증. 부분 수정보다 전체 파일 재전달이 안전

### ERR-003: fetch 중복/깨짐
- **에러:** `Expected ',', got '<eof>'` (괄호 에러로 표시되지만 실제는 코드 라인 깨짐)
- **원인:** 수동으로 한 줄 수정할 때 기존 코드를 복제하거나 아래 줄이 잘림
- **해결:** 해당 함수 블록 전체 교체
- **예방 규칙:** 1줄 수정 안내 시에도 전후 맥락 3줄 이상 포함해서 안내. 가능하면 파일 전체 재전달

### ERR-004: Module has no exported member
- **에러:** `Module '"./rate-limit"' has no exported member 'checkRateLimit'`
- **원인:** `api-guard.ts`가 요구하는 함수 시그니처와 `rate-limit.ts`가 제공하는 함수가 불일치
- **해결:** import하는 쪽(api-guard.ts)을 먼저 확인한 뒤, export하는 쪽(rate-limit.ts)의 함수명/시그니처를 맞춤
- **예방 규칙:** 새 유틸 파일 생성 시 기존에 import하는 파일이 있는지 grep 확인 필수. `grep -r "from.*rate-limit\|from.*auth\|from.*security" app/ lib/ --include="*.ts" --include="*.tsx"`

### ERR-005: proxy.ts 함수 이름 불일치
- **에러:** `Proxy is missing expected function export name`
- **원인:** Next.js 16에서 `middleware.ts` → `proxy.ts`로 전환할 때 함수명을 `middleware`에서 `proxy`로 안 바꿈
- **해결:** `export function middleware(req)` → `export function proxy(req)`
- **예방 규칙:** `proxy.ts` 파일을 만들 때 반드시 `export function proxy` 또는 `export default function` 사용. `middleware.ts`가 남아있으면 삭제

### ERR-006: 서버 컴포넌트에서 클라이언트 코드 사용
- **에러:** `Cannot use useState/useEffect in server component`
- **원인:** layout.tsx 같은 서버 컴포넌트에서 직접 useState 사용 불가
- **해결:** 클라이언트 로직은 별도 "use client" 컴포넌트로 분리 (예: Providers.tsx, DailyCounter.tsx)
- **예방 규칙:** layout.tsx/page.tsx(서버)에서 인터랙티브 기능 필요하면 반드시 별도 클라이언트 컴포넌트로 분리

---

## 🟡 런타임 에러 (실행 시)

### ERR-101: API 응답 필드명 불일치
- **증상:** `/cars` 페이지에 매물이 안 나옴
- **원인:** API가 `{ success, data, total }` 반환하는데 프론트에서 `d.cars`를 참조
- **해결:** `d.data || d.cars || []` 로 fallback 체인
- **예방 규칙:** API 응답 형식은 항상 `{ success, data }` 통일. 프론트에서는 `d.data || []` 패턴 사용

### ERR-102: 블로그 썸네일 안 보임
- **증상:** 블로그 목록에서 이미지 없이 빈 카드
- **원인:** `summary` 필드에 URL이 있는데 프론트에서 `post.thumbnail`을 찾음 (필드 없음)
- **해결:** `extractThumbnail()` 함수로 summary → content → img태그 순 3단계 추출
- **예방 규칙:** Prisma 스키마에 없는 필드를 프론트에서 참조하지 않기. 스키마 먼저 확인

### ERR-103: SMS 인증번호 안 옴
- **증상:** 회원가입 시 인증번호 미수신
- **원인:** SMS 서비스 미연동 (개발모드에서 콘솔 출력만)
- **해결:** devCode를 프론트에 직접 표시 (테스트 모드 UI)
- **예방 규칙:** 외부 서비스 미연동 기능은 개발 모드 fallback UI를 반드시 제공

### ERR-104: 로그인 상태 깜빡임
- **증상:** 로그인 후 새로고침 시 1초간 "로그인 하세요" 표시
- **원인:** 매 페이지 로드마다 /api/auth/session fetch → 응답 전까지 미인증 상태
- **해결:** AuthProvider + 30초 캐싱 + loading 상태에서 스피너 표시
- **예방 규칙:** 인증 상태는 전역 Context로 관리. 개별 페이지에서 각자 fetch하지 않기

### ERR-105: WelcomePopup 안 뜸
- **증상:** 로그인 후 팝업이 안 나타남
- **원인:** localStorage 체크 타이밍 + 세션 API 응답 지연
- **해결:** 1.5초 딜레이 + sessionStorage로 세션 내 중복 방지
- **예방 규칙:** 로그인 의존 UI는 세션 확인 완료 후 렌더링 (딜레이 or useAuth)

---

## 🟢 코드 작성 규칙 (예방)

### RULE-001: 파일 전달 시 전체 파일 보내기
- 부분 수정 안내 → 사용자가 잘못 붙여넣기 → 괄호 깨짐 반복
- **예외:** 1~2줄 단순 변경만 "몇번째 줄 → 교체" 허용

### RULE-002: 새 파일 만들기 전 의존성 확인
```bash
# 새 유틸 만들기 전 기존 import 확인
grep -r "from.*새파일명" app/ lib/ components/ --include="*.ts" --include="*.tsx"
```

### RULE-003: API 응답 형식 통일
```ts
// ✅ 항상 이 형식
{ success: true, data: [...] }
{ error: "메시지", status: 400 }

// ❌ 이렇게 하지 않기
{ cars: [...] }  // data 대신 cars
{ posts: [...] } // data 대신 posts
```

### RULE-004: Prisma 스키마 변경 후 체크리스트
1. `npx prisma db push` 실행
2. 관련 API route에서 새 필드 사용 확인
3. 프론트에서 참조하는 필드명과 일치 확인

### RULE-005: as const 배열 → 모든 객체 동일 키
```ts
// ❌ 에러 발생
const ITEMS = [
  { key: "a", required: true },
  { key: "b" },  // required 없음 → 타입 에러
] as const;

// ✅ 올바름
const ITEMS = [
  { key: "a", required: true },
  { key: "b", required: false },  // 명시적 false
] as const;
```

### RULE-006: Next.js 16 proxy.ts 규칙
- 파일명: `proxy.ts` (프로젝트 루트)
- 함수명: `export function proxy(req)` 또는 `export default function`
- 기존 `middleware.ts` 반드시 삭제

### RULE-007: 서버/클라이언트 컴포넌트 분리
- `app/layout.tsx` → 서버 컴포넌트 (useState/useEffect 불가)
- 인터랙티브 로직 → `components/XXX.tsx` ("use client") 분리
- layout에서 `<Providers>` 래퍼로 감싸기

### RULE-008: 코드 예시를 안내할 때
- "이 코드를 어딘가에 넣으세요" ❌
- 정확한 파일 전체를 재전달 ✅
- 또는 "N번째 줄 → 이 코드로 교체" 형식 ✅

---

## 📝 에러 추가 템플릿

### ERR-XXX: [에러 제목]
- **에러:** [에러 메시지]
- **원인:** [왜 발생했는지]
- **해결:** [어떻게 고쳤는지]
- **예방 규칙:** [앞으로 어떻게 방지하는지]
