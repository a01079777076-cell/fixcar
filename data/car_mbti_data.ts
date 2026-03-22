/* 차량 MBTI 데이터 v2 */

/* ═══ 4축 정의 ═══
 * D(Drive) vs C(Comfort)       — 주행 성향
 * S(Small) vs L(Large)         — 차량 크기
 * E(Economy) vs P(Premium)     — 예산 성향
 * H(High-tech) vs T(Traditional) — 기술 선호
 */

export interface MbtiQuestion {
  id: number;
  axis: "DC" | "SL" | "EP" | "HT";
  question: string;
  options: { text: string; score: number }[]; /* 양수=앞글자(D/S/E/H), 음수=뒷글자(C/L/P/T) */
}

export const QUESTIONS: MbtiQuestion[] = [
  /* ═══ D vs C (주행 성향) — 5문항 ═══ */
  { id:1, axis:"DC", question:"운전할 때 가장 즐거운 순간은?", options:[
    { text:"코너를 빠르게 돌 때 느끼는 짜릿함", score:2 },
    { text:"신호 없는 한적한 도로에서의 가속", score:1 },
    { text:"잔잔한 음악과 함께 여유로운 크루징", score:-1 },
    { text:"목적지까지 흔들림 없이 도착했을 때", score:-2 },
  ]},
  { id:2, axis:"DC", question:"고속도로에서 당신의 스타일은?", options:[
    { text:"추월차선 위주, 빈 곳 보이면 바로 가속", score:2 },
    { text:"흐름보다 살짝 빠르게, 적극적 차선변경", score:1 },
    { text:"흐름에 맞춰서 편하게 주행", score:-1 },
    { text:"크루즈 컨트롤 걸고 2차선에서 안정적으로", score:-2 },
  ]},
  { id:3, axis:"DC", question:"와인딩(산길 커브) 도로를 만나면?", options:[
    { text:"신난다! 스포츠 모드 ON", score:2 },
    { text:"적당히 재미있게 달려볼 만한 구간", score:1 },
    { text:"천천히 경치 감상하면서 가면 되지", score:-1 },
    { text:"솔직히 멀미 날까봐 걱정부터...", score:-2 },
  ]},
  { id:4, axis:"DC", question:"서스펜션을 세팅할 수 있다면?", options:[
    { text:"최대한 단단하게! 도로가 느껴져야 운전 맛", score:2 },
    { text:"약간 단단한 스포츠 세팅", score:1 },
    { text:"부드러운 기본 세팅이 좋아", score:-1 },
    { text:"구름 위를 달리는 것처럼 최대한 부드럽게", score:-2 },
  ]},
  { id:5, axis:"DC", question:"차를 사면 가장 먼저 하고 싶은 건?", options:[
    { text:"서킷 데이 예약하기", score:2 },
    { text:"해안도로 드라이브 코스 짜기", score:1 },
    { text:"가족이랑 편하게 근교 나들이", score:-1 },
    { text:"출퇴근길 편안하게 세팅하기", score:-2 },
  ]},

  /* ═══ S vs L (차량 크기) — 5문항 ═══ */
  { id:6, axis:"SL", question:"주차할 때 당신의 마음은?", options:[
    { text:"골목이든 어디든 쏙쏙 들어가야 편해", score:2 },
    { text:"웬만한 곳은 다 되는 적당한 크기가 좋아", score:1 },
    { text:"주차는 좀 힘들어도 넓은 차가 좋아", score:-1 },
    { text:"발레파킹 맡기면 되지, 크기는 상관없어", score:-2 },
  ]},
  { id:7, axis:"SL", question:"평소 차에 타는 사람은?", options:[
    { text:"거의 혼자, 가끔 1명 더", score:2 },
    { text:"보통 2~3명", score:1 },
    { text:"4~5명 가족 단위", score:-1 },
    { text:"5명 이상, 짐도 많이 싣는 편", score:-2 },
  ]},
  { id:8, axis:"SL", question:"트렁크에 주로 싣는 물건은?", options:[
    { text:"가방 하나면 충분", score:2 },
    { text:"장볼 때 쇼핑백 몇 개 정도", score:1 },
    { text:"유모차 + 짐이 꽤 있는 편", score:-1 },
    { text:"캠핑 장비, 자전거까지 다 실어야 해", score:-2 },
  ]},
  { id:9, axis:"SL", question:"이상적인 차의 모습은?", options:[
    { text:"도심에서 날렵하게 빠지는 작은 차", score:2 },
    { text:"적당한 크기의 세단이나 해치백", score:1 },
    { text:"듬직한 중형 SUV", score:-1 },
    { text:"어디서든 존재감 있는 대형 SUV/미니밴", score:-2 },
  ]},
  { id:10, axis:"SL", question:"여행 갈 때 짐 스타일은?", options:[
    { text:"백팩 하나로 미니멀하게", score:2 },
    { text:"캐리어 하나 + 작은 가방", score:1 },
    { text:"캐리어 2~3개 + 이것저것 많은 편", score:-1 },
    { text:"차에 가득 채워서 가는 스타일", score:-2 },
  ]},

  /* ═══ E vs P (예산 성향) — 5문항 ═══ */
  { id:11, axis:"EP", question:"차를 고를 때 가장 먼저 보는 건?", options:[
    { text:"가격 대비 성능, 가성비가 최우선", score:2 },
    { text:"적당한 가격에 필요한 기능만 있으면 OK", score:1 },
    { text:"좀 더 내도 좋은 옵션과 품질을 원해", score:-1 },
    { text:"최고급 사양, 가격은 크게 신경 안 써", score:-2 },
  ]},
  { id:12, axis:"EP", question:"같은 2000만원이라면?", options:[
    { text:"국산 풀옵션! 가성비 끝판왕", score:2 },
    { text:"국산 적당한 옵션 + 여유자금 남기기", score:1 },
    { text:"수입 중고로 한 단계 높은 브랜드 경험", score:-1 },
    { text:"더 모아서 진짜 원하는 프리미엄 차 사겠어", score:-2 },
  ]},
  { id:13, axis:"EP", question:"유지비에 대한 생각은?", options:[
    { text:"유지비가 곧 실력, 최대한 아끼는 게 좋아", score:2 },
    { text:"합리적인 선에서 관리하면 돼", score:1 },
    { text:"편하고 좋은 서비스엔 투자할 의향 있어", score:-1 },
    { text:"돈 쓸 때 쓰자, 좋은 부품과 서비스 우선", score:-2 },
  ]},
  { id:14, axis:"EP", question:"옵션을 고를 때 당신은?", options:[
    { text:"기본형이면 충분해, 나머지는 사치", score:2 },
    { text:"안전옵션만 추가하고 나머진 패스", score:1 },
    { text:"편의옵션도 웬만한 건 다 넣고 싶어", score:-1 },
    { text:"풀옵션 아니면 의미 없지", score:-2 },
  ]},
  { id:15, axis:"EP", question:"브랜드에 대한 생각은?", options:[
    { text:"브랜드보다 실속! 좋으면 어디 차든 OK", score:2 },
    { text:"검증된 국산 브랜드면 충분", score:1 },
    { text:"프리미엄 브랜드의 감성이 좋더라", score:-1 },
    { text:"타면 아는 브랜드 파워, 확실히 다르더라", score:-2 },
  ]},

  /* ═══ H vs T (기술 선호) — 5문항 ═══ */
  { id:16, axis:"HT", question:"새 차에 꼭 있어야 하는 기능은?", options:[
    { text:"자율주행 보조, OTA 업데이트, 차량용 AI", score:2 },
    { text:"최신 ADAS + 큰 디스플레이면 충분", score:1 },
    { text:"네비 + 후방카메라 정도면 OK", score:-1 },
    { text:"복잡한 기능 싫어, 단순할수록 좋아", score:-2 },
  ]},
  { id:17, axis:"HT", question:"전기차에 대한 생각은?", options:[
    { text:"무조건 전기차! 미래는 EV", score:2 },
    { text:"하이브리드 정도면 좋을 듯", score:1 },
    { text:"아직은 내연기관이 편하고 안심", score:-1 },
    { text:"전기차는 충전 불편하고 불안해. 디젤/가솔린이 최고", score:-2 },
  ]},
  { id:18, axis:"HT", question:"차 안에서 스마트폰 연동은?", options:[
    { text:"무선 카플레이/안드로이드오토 필수, 없으면 안 삼", score:2 },
    { text:"블루투스 연결은 기본이지", score:1 },
    { text:"라디오랑 USB면 충분해", score:-1 },
    { text:"CD플레이어가 있던 시절이 좋았어", score:-2 },
  ]},
  { id:19, axis:"HT", question:"계기판 스타일 선호는?", options:[
    { text:"풀 디지털 + 커스텀 테마 + HUD", score:2 },
    { text:"디지털 계기판이면 좋겠어", score:1 },
    { text:"아날로그 + 작은 LCD 조합이 보기 편해", score:-1 },
    { text:"바늘 게이지가 진짜 RPM을 느끼게 해줘", score:-2 },
  ]},
  { id:20, axis:"HT", question:"차량 업데이트 방식은?", options:[
    { text:"OTA(무선) 업데이트로 계속 진화하는 차!", score:2 },
    { text:"가끔 서비스센터에서 소프트웨어 업데이트 정도", score:1 },
    { text:"기계적으로 튼튼하면 업데이트 필요 없어", score:-1 },
    { text:"10년 전 차도 잘 굴러가는데 뭘 업데이트해", score:-2 },
  ]},
];

/* ═══ 16유형 정의 ═══ */
export interface MbtiType {
  code: string;
  emoji: string;
  name: string;
  vibe: string;
  subtitle: string;
  desc: string;
  cars: string[];
  tags: string[];
  color: string;
}

export const MBTI_TYPES: Record<string, MbtiType> = {
  "DSET": {
    code:"DSET", emoji:"🏎️", name:"골목길 드리프터",
    vibe:"신호 바뀌면 출발 부스터",
    subtitle:"작고 빠른 차로 도심 골목을 지배하는 스트리트 레이서",
    desc:"신호가 초록색으로 바뀌는 순간이 하루 중 가장 행복한 당신. 작지만 빠르고, 저렴하지만 달릴 때는 스포츠카 못지않은 가성비 스포츠의 끝판왕.",
    cars:["현대 아반떼 N Line","기아 K3 GT","현대 벨로스터 N","혼다 시빅"],
    tags:["#골목왕","#신호대기킬러","#RPM중독"],
    color:"#FF5A3C",
  },
  "DSEH": {
    code:"DSEH", emoji:"⚡", name:"무소음 킬러",
    vibe:"뒤 없는 테무 슈마허",
    subtitle:"전기차의 무소음 가속을 즐기는 조용한 스피드 광",
    desc:"배기음? 필요 없어. 전기 모터의 즉각적인 토크로 조용히, 하지만 확실하게 앞차를 제치는 게 내 스타일. 소리 없이 강한 자가 진짜 강한 거야.",
    cars:["테슬라 모델3","현대 아이오닉5 N","기아 EV6 GT","폴스타2"],
    tags:["#무소음질주","#전기충격","#테슬라겜"],
    color:"#00C471",
  },
  "DSPT": {
    code:"DSPT", emoji:"🦡", name:"벌꿀오소리",
    vibe:"다시는 소형을 무시하지 마라",
    subtitle:"작지만 프리미엄, 건드리면 안 되는 소형 맹수",
    desc:"외형은 귀여운데 밟으면 미친 듯이 달리는, 길 위의 벌꿀오소리. 작다고 무시했다가 백미러에서 사라지는 경험을 선사해줌.",
    cars:["미니 쿠퍼 S","아우디 A3 45 TFSI","BMW M135i","폭스바겐 골프 GTI"],
    tags:["#작은고추","#프리미엄핫해치","#무시금지"],
    color:"#9B30FF",
  },
  "DSPH": {
    code:"DSPH", emoji:"🎮", name:"전기 고카트",
    vibe:"제로백 자랑이 인사말",
    subtitle:"최신 전기 기술 + 프리미엄 퍼포먼스의 얼리어답터",
    desc:"만나면 첫마디가 '내 차 제로백이 몇 초인지 알아?'인 사람. 최신 전기차 기술에 미쳐있고, 작지만 빠른 전기 머신에 푹 빠진 테크 레이서.",
    cars:["BMW i4 M50","폴스타2 퍼포먼스","테슬라 모델3 퍼포먼스","아우디 Q4 e-tron"],
    tags:["#제로백자랑","#얼리어답터","#전기고성능"],
    color:"#3060FF",
  },
  "DLET": {
    code:"DLET", emoji:"🦬", name:"가성비 불도저",
    vibe:"덩치값 안 한다고? 밟아봐",
    subtitle:"크고 힘세고 저렴한, 가성비 끝판왕 파워 SUV",
    desc:"뭐든 실어주고, 누구든 태워주고, 어디든 가주는 든든한 불도저. 근데 밟으면 이 덩치가? 싶을 정도로 잘 달림. 가성비로 세상을 평정하는 현실 만렙.",
    cars:["현대 싼타페","기아 쏘렌토","현대 투싼 N Line","쉐보레 트래버스"],
    tags:["#만능불도저","#가성비만렙","#SUV는국룰"],
    color:"#CC6633",
  },
  "DLEH": {
    code:"DLEH", emoji:"🗺️", name:"충전 유목민",
    vibe:"충전소 찾다 보니 전국일주 함",
    subtitle:"큰 전기 SUV로 충전 여행 다니는 친환경 어드벤처러",
    desc:"'이 근처 급속충전소 어디야?'가 내비보다 먼저 나오는 말. 충전소 찾아다니다 보니 어느새 전국 맛집도 다 섭렵한 의도치 않은 여행 고수.",
    cars:["기아 EV9","현대 아이오닉5 롱레인지","테슬라 모델Y","쉐보레 이쿼녹스 EV"],
    tags:["#충전소헌터","#전국일주","#전기SUV"],
    color:"#2D8A52",
  },
  "DLPT": {
    code:"DLPT", emoji:"🔊", name:"배기음 ASMR",
    vibe:"V6 울리면 창문부터 내림",
    subtitle:"대형 프리미엄의 엔진 사운드에 중독된 그랜드 투어러",
    desc:"시동 거는 순간 울려퍼지는 배기음이 오늘 하루의 BGM. 터널 지날 때 일부러 창문 내리고 배기음 반사를 즐기는, 감성과 파워를 동시에 가진 도로 위의 왕.",
    cars:["제네시스 G90","BMW 7시리즈","벤츠 S클래스 AMG","포르쉐 카이엔 GTS"],
    tags:["#배기음중독","#터널드라이브","#V6이상만"],
    color:"#1A1A1A",
  },
  "DLPH": {
    code:"DLPH", emoji:"🦾", name:"도로 위 아이언맨",
    vibe:"핸들 잡는 건 레트로 감성",
    subtitle:"최고급 전기 대형차로 시대를 앞서가는 선구자",
    desc:"자율주행 레벨이 올라갈 때마다 흥분하는 사람. '핸들은 언젠가 사라질 거야'라고 진지하게 말하면서 최신 전기 플래그십으로 미래를 먼저 사는 중.",
    cars:["벤츠 EQS SUV","테슬라 모델X","BMW iX xDrive50","기아 EV9 GT"],
    tags:["#미래에서옴","#자율주행대기","#테크플래그십"],
    color:"#E8A020",
  },
  "CSET": {
    code:"CSET", emoji:"🧚", name:"연비 요정",
    vibe:"주유비가 진짜 커피값",
    subtitle:"연비 좋은 소형차로 유지비 거의 0원에 도전하는 실속파",
    desc:"한 달 주유비가 카페라떼 3잔값이라는 전설의 연비왕. 연비 앱 깔아서 매일 체크하고, 에코 모드는 기본. '내 차 리터당 18 나와~'가 자랑의 시작.",
    cars:["기아 모닝","현대 캐스퍼","기아 레이","쉐보레 스파크"],
    tags:["#연비맛집","#유지비제로","#커피값주유"],
    color:"#00C471",
  },
  "CSEH": {
    code:"CSEH", emoji:"🔌", name:"충전 기생충",
    vibe:"회사 전기로 출퇴근 해결",
    subtitle:"전기 소형차로 회사 충전기 꽂아두고 유지비 0원 달성",
    desc:"회사 주차장 충전기 자리를 위해 30분 일찍 출근하는 사람. '집에서 충전? 아니 회사에서 공짜로 하면 되지~' 유지비를 기술로 해결하는 현대판 돈키호테.",
    cars:["현대 코나 일렉트릭","쉐보레 볼트EV","기아 니로 EV","BMW iX1"],
    tags:["#회사전기도둑","#유지비해킹","#공짜충전"],
    color:"#3060FF",
  },
  "CSPT": {
    code:"CSPT", emoji:"☕", name:"에스프레소",
    vibe:"작은데 진하고 있어보임",
    subtitle:"작지만 고급, 에스프레소처럼 진한 감성의 프리미엄 소형",
    desc:"사이즈는 작아도 한 모금에 '다르다'를 느끼게 하는 에스프레소 같은 차. 가죽 냄새, 조용한 실내, 작지만 확실한 프리미엄. '차는 작아도 급은 높게' 주의.",
    cars:["미니 쿠퍼","볼보 XC40","아우디 Q3","렉서스 UX"],
    tags:["#작은사치","#카페감성","#소확프"],
    color:"#8B6914",
  },
  "CSPH": {
    code:"CSPH", emoji:"📊", name:"가계부 흑대",
    vibe:"보험료까지 원 단위로 추적함",
    subtitle:"최신 전기 소형차로 유지비 원 단위까지 추적하는 전략가",
    desc:"엑셀로 유지비 스프레드시트 만들어서 매달 업데이트하는 사람. 보험료, 충전비, 타이어 마모율까지 계산해서 '전기차가 3년 차에 손익분기 넘어'라고 프레젠테이션 하는 리얼 가계부 흑대.",
    cars:["볼보 EX30","아이오닉6","렉서스 UX 300e","BMW iX1"],
    tags:["#엑셀시트","#손익분기","#유지비마스터"],
    color:"#1847FF",
  },
  "CLET": {
    code:"CLET", emoji:"📦", name:"짐승",
    vibe:"3열 접으면 이삿짐센터 개업 가능",
    subtitle:"넓고 편하고 경제적인 가족의 든든한 짐승(짐+SUV)",
    desc:"3열 접고 트렁크 열면 이삿짐센터 부럽지 않은 적재 공간. 코스트코 갈 때 진가를 발휘하고, 캠핑 장비도 여유롭게. 가족의 짐을 다 실어주는 든든한 짐승.",
    cars:["기아 카니발","현대 싼타페","기아 쏘렌토","현대 스타리아"],
    tags:["#이사가능","#코스트코전용","#캠핑마스터"],
    color:"#CC6633",
  },
  "CLEH": {
    code:"CLEH", emoji:"🌍", name:"에코 전도사",
    vibe:"애들한테 지구 지킨다고 말함",
    subtitle:"큰 전기차로 가족과 함께 지구를 지키는 친환경 부모",
    desc:"'우리 차는 전기차라서 매연이 안 나와~'를 애들한테 매일 교육하는 부모. 환경도 생각하고, 공간도 넓고, 기술도 최신인 전기 SUV로 완벽한 에코 라이프 실현 중.",
    cars:["기아 EV9","현대 아이오닉5","테슬라 모델Y","볼보 EX90"],
    tags:["#친환경아빠","#지구지킴이","#ESG육아"],
    color:"#2D8A52",
  },
  "CLPT": {
    code:"CLPT", emoji:"👔", name:"뒷좌석 귀족",
    vibe:"기사님 강남이요 에너지",
    subtitle:"뒷좌석에서 쉬면서 이동하는 것을 꿈꾸는 편안함의 끝판왕",
    desc:"탈 때 뒷좌석부터 확인하는 사람. 시트 리클라이닝 각도, 레그룸, 뒷좌석 모니터가 차 살 때 체크리스트 1번. 언젠가 기사님이 생기면 완성될 인생 로드맵.",
    cars:["제네시스 G80","벤츠 E클래스","BMW 5시리즈","렉서스 ES"],
    tags:["#뒷좌석파","#기사님꿈","#리무진감성"],
    color:"#9B30FF",
  },
  "CLPH": {
    code:"CLPH", emoji:"🏆", name:"라스보스",
    vibe:"자율주행 나오면 Day1 구매각",
    subtitle:"최고급 전기 대형차의 최종 보스, 자율주행 Day1 예약자",
    desc:"'완전 자율주행 나오면 그날 바로 삽니다.' 최신 기술, 최대 공간, 최고급 품질을 전부 갖춘 차만 눈에 들어오는 최종 보스. 차가 곧 기술력의 상징.",
    cars:["벤츠 EQS SUV","BMW iX","기아 EV9 GT","테슬라 모델X"],
    tags:["#최종보스","#Day1구매","#기술만렙"],
    color:"#FF3B1E",
  },
};

/* 축 설명 */
export const AXIS_INFO = {
  DC: { left:"D (Drive)", right:"C (Comfort)", leftDesc:"주행의 재미 추구", rightDesc:"편안한 승차감 추구", leftEmoji:"🏎️", rightEmoji:"🛋️" },
  SL: { left:"S (Small)", right:"L (Large)", leftDesc:"소형·경차 선호", rightDesc:"SUV·대형 선호", leftEmoji:"🚗", rightEmoji:"🚙" },
  EP: { left:"E (Economy)", right:"P (Premium)", leftDesc:"가성비·경제적", rightDesc:"고급·프리미엄", leftEmoji:"💰", rightEmoji:"💎" },
  HT: { left:"H (High-tech)", right:"T (Traditional)", leftDesc:"최신기술·전기차", rightDesc:"검증된 기술·내연기관", leftEmoji:"🤖", rightEmoji:"🔧" },
};
