/**
 * BM에 있지만 CAR_GRADES에 누락된 70개 모델에 grades 추가.
 * 가격: 출시 당시 만원 단위. 단종 차종은 출시초기 권장가 기준.
 *
 *   dry-run:  npx tsx scripts/add-missing-grades.ts
 *   apply:    npx tsx scripts/add-missing-grades.ts --apply
 */

import * as fs from "fs";
import * as path from "path";

const FILE = path.join(process.cwd(), "data", "catalog_data.ts");

type Grade = {
  grade: string;
  price: number;
  engine: string;
  power: string;
  torque: string;
  efficiency: string;
};

const NEW_GRADES: Record<string, Grade[]> = {
  // ===== 현대 =====
  "캐스퍼 일렉트릭 AX1e": [
    { grade: "스탠다드", price: 2740, engine: "전기모터", power: "115", torque: "15.0", efficiency: "5.6km/kWh" },
    { grade: "인스퍼레이션", price: 3120, engine: "전기모터", power: "115", torque: "15.0", efficiency: "5.6km/kWh" },
  ],
  "넥쏘 FE2": [
    { grade: "프리미엄", price: 7659, engine: "수소연료전지", power: "204", torque: "40.4", efficiency: "93.7km/kg" },
    { grade: "익스클루시브", price: 8225, engine: "수소연료전지", power: "204", torque: "40.4", efficiency: "93.7km/kg" },
  ],
  "포터 2 일렉트릭": [
    { grade: "스마트", price: 4347, engine: "전기모터", power: "135", torque: "40.3", efficiency: "3.1km/kWh" },
    { grade: "프리미엄", price: 4577, engine: "전기모터", power: "135", torque: "40.3", efficiency: "3.1km/kWh" },
  ],
  "마이티 WQ": [
    { grade: "표준 카고", price: 4200, engine: "F4 디젤", power: "170", torque: "40.0", efficiency: "8.5" },
    { grade: "와이드캡 카고", price: 4650, engine: "F4 디젤", power: "170", torque: "40.0", efficiency: "8.5" },
  ],
  "쏠라티 EY4": [
    { grade: "5밴", price: 5660, engine: "2.5 디젤", power: "170", torque: "44.0", efficiency: "9.0" },
    { grade: "11승", price: 5990, engine: "2.5 디젤", power: "170", torque: "44.0", efficiency: "9.0" },
    { grade: "15승", price: 6300, engine: "2.5 디젤", power: "170", torque: "44.0", efficiency: "9.0" },
  ],
  "ST1 NK4": [
    { grade: "카고 스마트", price: 5980, engine: "전기모터", power: "160", torque: "35.7", efficiency: "3.7km/kWh" },
    { grade: "카고 프리미엄", price: 6360, engine: "전기모터", power: "160", torque: "35.7", efficiency: "3.7km/kWh" },
  ],
  "카운티": [
    { grade: "에코 25인승", price: 6300, engine: "3.9 디젤", power: "170", torque: "65.0", efficiency: "5.0" },
    { grade: "롱 33인승", price: 7100, engine: "3.9 디젤", power: "170", torque: "65.0", efficiency: "5.0" },
  ],
  "포니 P1": [
    { grade: "1238cc", price: 250, engine: "1.2 가솔린", power: "55", torque: "9.0", efficiency: "11.0" },
    { grade: "1438cc", price: 290, engine: "1.4 가솔린", power: "68", torque: "11.0", efficiency: "10.5" },
  ],
  "그라나다": [
    { grade: "2.0", price: 480, engine: "2.0 가솔린", power: "108", torque: "16.5", efficiency: "9.0" },
    { grade: "2.8", price: 690, engine: "2.8 가솔린", power: "150", torque: "22.0", efficiency: "8.0" },
  ],
  "스텔라 Y1": [
    { grade: "1.4", price: 380, engine: "1.4 가솔린", power: "82", torque: "11.5", efficiency: "12.5" },
    { grade: "1.6", price: 450, engine: "1.6 가솔린", power: "95", torque: "13.5", efficiency: "11.5" },
  ],
  "프레스토 X1": [
    { grade: "1.3", price: 290, engine: "1.3 가솔린", power: "70", torque: "10.5", efficiency: "13.0" },
    { grade: "1.5", price: 340, engine: "1.5 가솔린", power: "84", torque: "12.4", efficiency: "12.5" },
  ],
  "쏘나타 Y1": [
    { grade: "1.8", price: 660, engine: "1.8 가솔린", power: "98", torque: "15.0", efficiency: "10.5" },
    { grade: "2.0", price: 800, engine: "2.0 가솔린", power: "110", torque: "17.5", efficiency: "10.0" },
  ],
  "그랜저 L": [
    { grade: "2.0", price: 1380, engine: "2.0 V6 가솔린", power: "115", torque: "17.0", efficiency: "8.5" },
    { grade: "2.4", price: 1680, engine: "2.4 가솔린", power: "130", torque: "19.5", efficiency: "8.0" },
    { grade: "3.0", price: 2200, engine: "3.0 V6 가솔린", power: "145", torque: "23.5", efficiency: "7.5" },
  ],
  "그레이스": [
    { grade: "9인승 디젤", price: 980, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.5" },
    { grade: "12인승 디젤", price: 1100, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.0" },
  ],
  "쏘나타 Y2": [
    { grade: "1.8", price: 990, engine: "1.8 가솔린", power: "100", torque: "15.5", efficiency: "11.0" },
    { grade: "2.0", price: 1180, engine: "2.0 가솔린", power: "133", torque: "18.0", efficiency: "10.5" },
    { grade: "3.0 V6", price: 1680, engine: "3.0 V6 가솔린", power: "145", torque: "23.5", efficiency: "8.5" },
  ],
  "엑셀 X2": [
    { grade: "1.3", price: 460, engine: "1.3 가솔린", power: "73", torque: "10.5", efficiency: "14.5" },
    { grade: "1.5", price: 540, engine: "1.5 가솔린", power: "88", torque: "13.0", efficiency: "13.5" },
  ],
  "엘란트라 J1": [
    { grade: "1.5", price: 690, engine: "1.5 가솔린", power: "92", torque: "13.6", efficiency: "13.5" },
    { grade: "1.6", price: 770, engine: "1.6 DOHC 가솔린", power: "114", torque: "14.5", efficiency: "12.5" },
    { grade: "1.8", price: 880, engine: "1.8 가솔린", power: "126", torque: "16.0", efficiency: "11.5" },
  ],
  "스쿠프 RD-1": [
    { grade: "1.5 SOHC", price: 720, engine: "1.5 가솔린", power: "88", torque: "12.6", efficiency: "13.0" },
    { grade: "1.5 터보", price: 880, engine: "1.5 터보", power: "115", torque: "17.5", efficiency: "12.0" },
  ],
  "갤로퍼 MK1": [
    { grade: "2.5 TCI 디젤", price: 1380, engine: "2.5 TCI 디젤", power: "100", torque: "23.0", efficiency: "9.5" },
    { grade: "3.0 V6 가솔린", price: 1750, engine: "3.0 V6 가솔린", power: "145", torque: "23.5", efficiency: "7.5" },
  ],
  "그랜저 LX": [
    { grade: "2.0 V6", price: 1980, engine: "2.0 V6 가솔린", power: "146", torque: "19.4", efficiency: "9.0" },
    { grade: "2.5 V6", price: 2280, engine: "2.5 V6 가솔린", power: "175", torque: "23.0", efficiency: "8.5" },
    { grade: "3.0 V6", price: 2680, engine: "3.0 V6 가솔린", power: "215", torque: "27.5", efficiency: "7.8" },
  ],
  "쏘나타 Y3": [
    { grade: "1.8 DOHC", price: 1180, engine: "1.8 DOHC 가솔린", power: "126", torque: "16.5", efficiency: "11.5" },
    { grade: "2.0 DOHC", price: 1350, engine: "2.0 DOHC 가솔린", power: "146", torque: "19.0", efficiency: "10.5" },
    { grade: "3.0 V6", price: 1850, engine: "3.0 V6 가솔린", power: "195", torque: "26.0", efficiency: "8.5" },
  ],
  "아반떼 J2": [
    { grade: "1.5 SOHC", price: 760, engine: "1.5 가솔린", power: "92", torque: "13.6", efficiency: "14.0" },
    { grade: "1.5 DOHC", price: 850, engine: "1.5 DOHC 가솔린", power: "112", torque: "14.5", efficiency: "13.5" },
    { grade: "1.8 DOHC", price: 950, engine: "1.8 DOHC 가솔린", power: "130", torque: "16.5", efficiency: "12.5" },
  ],
  "마르샤 LX": [
    { grade: "2.0 V6", price: 1680, engine: "2.0 V6 가솔린", power: "146", torque: "19.4", efficiency: "9.5" },
    { grade: "2.5 V6", price: 1980, engine: "2.5 V6 가솔린", power: "175", torque: "23.0", efficiency: "9.0" },
  ],
  "싼타모 SZ": [
    { grade: "2.0 가솔린", price: 1180, engine: "2.0 가솔린", power: "139", torque: "18.0", efficiency: "10.0" },
    { grade: "2.0 디젤", price: 1290, engine: "2.0 디젤", power: "82", torque: "20.5", efficiency: "13.5" },
  ],
  "다이너스티 LX3": [
    { grade: "3.0 V6", price: 3680, engine: "3.0 V6 가솔린", power: "200", torque: "26.5", efficiency: "8.5" },
    { grade: "3.5 V6", price: 4280, engine: "3.5 V6 가솔린", power: "220", torque: "30.5", efficiency: "8.0" },
  ],
  "티뷰론 RD": [
    { grade: "1.8 DOHC", price: 1180, engine: "1.8 DOHC 가솔린", power: "138", torque: "17.0", efficiency: "11.5" },
    { grade: "2.0 DOHC", price: 1380, engine: "2.0 DOHC 가솔린", power: "146", torque: "19.0", efficiency: "10.5" },
  ],
  "갤로퍼 MK2 II": [
    { grade: "2.5 TCI 디젤", price: 1680, engine: "2.5 TCI 디젤", power: "103", torque: "26.5", efficiency: "10.5" },
    { grade: "3.0 V6 가솔린", price: 2080, engine: "3.0 V6 가솔린", power: "145", torque: "23.5", efficiency: "7.5" },
  ],
  "리베로 RL": [
    { grade: "2.5 디젤 카고", price: 1080, engine: "2.5 디젤", power: "94", torque: "23.0", efficiency: "11.0" },
    { grade: "2.5 디젤 더블캡", price: 1180, engine: "2.5 디젤", power: "94", torque: "23.0", efficiency: "10.5" },
  ],
  "라비타 FC": [
    { grade: "1.6", price: 1080, engine: "1.6 가솔린", power: "105", torque: "14.5", efficiency: "12.5" },
    { grade: "1.8", price: 1280, engine: "1.8 가솔린", power: "122", torque: "16.5", efficiency: "11.5" },
  ],
  "투스카니 GK": [
    { grade: "2.0 베타", price: 1480, engine: "2.0 DOHC 가솔린", power: "143", torque: "18.5", efficiency: "10.0" },
    { grade: "2.7 V6 엘리사", price: 1880, engine: "2.7 V6 가솔린", power: "175", torque: "25.5", efficiency: "8.5" },
  ],
  "매트릭스 FC": [
    { grade: "1.6", price: 990, engine: "1.6 가솔린", power: "105", torque: "14.5", efficiency: "13.0" },
    { grade: "1.8", price: 1180, engine: "1.8 가솔린", power: "122", torque: "16.5", efficiency: "12.0" },
    { grade: "1.5 CRDi", price: 1280, engine: "1.5 CRDi 디젤", power: "82", torque: "21.0", efficiency: "16.0" },
  ],
  "포터 1 AU": [
    { grade: "2.5 디젤 슈퍼캡", price: 850, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.5" },
    { grade: "2.5 디젤 더블캡", price: 950, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.0" },
  ],
  "스타렉스 TQ": [
    { grade: "12인승 가솔린", price: 2380, engine: "2.4 가솔린", power: "170", torque: "23.0", efficiency: "8.5" },
    { grade: "12인승 디젤", price: 2580, engine: "2.5 CRDi 디젤", power: "175", torque: "45.0", efficiency: "10.5" },
    { grade: "그랜드 스타렉스 어반", price: 3380, engine: "2.5 CRDi 디젤", power: "175", torque: "45.0", efficiency: "10.0" },
  ],
  "아슬란 AG": [
    { grade: "G300", price: 3990, engine: "3.0 V6 람다", power: "266", torque: "31.6", efficiency: "9.5" },
    { grade: "G330", price: 4590, engine: "3.3 V6 람다", power: "294", torque: "35.0", efficiency: "9.3" },
  ],
  "마이티 WT1": [
    { grade: "표준 카고", price: 3680, engine: "F4 디젤", power: "170", torque: "40.0", efficiency: "8.5" },
    { grade: "와이드캡 카고", price: 4180, engine: "F4 디젤", power: "170", torque: "40.0", efficiency: "8.5" },
  ],

  // ===== 기아 =====
  "레이 EV TAM": [
    { grade: "에어", price: 2735, engine: "전기모터", power: "87", torque: "15.0", efficiency: "5.1km/kWh" },
    { grade: "라이트", price: 2855, engine: "전기모터", power: "87", torque: "15.0", efficiency: "5.1km/kWh" },
    { grade: "프레스티지", price: 2955, engine: "전기모터", power: "87", torque: "15.0", efficiency: "5.1km/kWh" },
  ],
  "그랜버드": [
    { grade: "이노베이션 41인승", price: 21000, engine: "12.7 디젤", power: "430", torque: "210.0", efficiency: "3.0" },
    { grade: "실크로드 45인승", price: 23500, engine: "12.7 디젤", power: "430", torque: "210.0", efficiency: "3.0" },
  ],
  "브리사 A": [
    { grade: "1.0 4도어", price: 220, engine: "1.0 가솔린", power: "44", torque: "7.0", efficiency: "16.0" },
    { grade: "픽업", price: 260, engine: "1.0 가솔린", power: "44", torque: "7.0", efficiency: "15.5" },
  ],
  "베스타": [
    { grade: "9인승 디젤", price: 880, engine: "2.2 디젤", power: "73", torque: "15.6", efficiency: "11.0" },
    { grade: "12인승 디젤", price: 980, engine: "2.2 디젤", power: "73", torque: "15.6", efficiency: "10.5" },
  ],
  "세레스 J2": [
    { grade: "디젤 카고", price: 580, engine: "2.4 디젤", power: "70", torque: "14.5", efficiency: "11.5" },
    { grade: "디젤 더블캡", price: 650, engine: "2.4 디젤", power: "70", torque: "14.5", efficiency: "11.0" },
  ],
  "프레지오": [
    { grade: "9인승 디젤", price: 1080, engine: "2.7 디젤", power: "80", torque: "17.5", efficiency: "10.5" },
    { grade: "15인승 디젤", price: 1280, engine: "2.7 디젤", power: "80", torque: "17.5", efficiency: "10.0" },
  ],
  "포텐샤": [
    { grade: "2.0 V6", price: 1980, engine: "2.0 V6 가솔린", power: "115", torque: "17.5", efficiency: "8.5" },
    { grade: "2.5 V6", price: 2380, engine: "2.5 V6 가솔린", power: "175", torque: "23.0", efficiency: "8.0" },
    { grade: "3.0 V6", price: 2880, engine: "3.0 V6 가솔린", power: "200", torque: "26.5", efficiency: "7.5" },
  ],
  "세피아": [
    { grade: "1.5", price: 720, engine: "1.5 가솔린", power: "82", torque: "12.0", efficiency: "14.0" },
    { grade: "1.6 DOHC", price: 850, engine: "1.6 DOHC 가솔린", power: "115", torque: "14.5", efficiency: "12.5" },
    { grade: "1.8 DOHC", price: 950, engine: "1.8 DOHC 가솔린", power: "126", torque: "16.5", efficiency: "11.5" },
  ],
  "아벨라": [
    { grade: "1.3", price: 480, engine: "1.3 가솔린", power: "75", torque: "10.5", efficiency: "14.5" },
    { grade: "1.5", price: 560, engine: "1.5 가솔린", power: "92", torque: "12.6", efficiency: "13.5" },
  ],
  "크레도스": [
    { grade: "1.8 DOHC", price: 1080, engine: "1.8 DOHC 가솔린", power: "126", torque: "16.5", efficiency: "11.5" },
    { grade: "2.0 DOHC", price: 1280, engine: "2.0 DOHC 가솔린", power: "139", torque: "18.5", efficiency: "10.5" },
  ],
  "엔터프라이즈": [
    { grade: "2.5 V6", price: 2480, engine: "2.5 V6 가솔린", power: "175", torque: "23.0", efficiency: "8.5" },
    { grade: "3.0 V6", price: 2980, engine: "3.0 V6 가솔린", power: "200", torque: "26.0", efficiency: "8.0" },
    { grade: "3.6 V6", price: 3580, engine: "3.6 V6 가솔린", power: "220", torque: "32.0", efficiency: "7.5" },
  ],
  "스포티지 NB": [
    { grade: "2.0 가솔린", price: 1280, engine: "2.0 가솔린", power: "128", torque: "17.5", efficiency: "9.5" },
    { grade: "2.0 디젤", price: 1380, engine: "2.0 터보디젤", power: "83", torque: "20.0", efficiency: "11.5" },
  ],
  "레토나": [
    { grade: "2.0 디젤", price: 1280, engine: "2.0 터보디젤", power: "83", torque: "20.0", efficiency: "11.5" },
    { grade: "2.0 가솔린", price: 1180, engine: "2.0 가솔린", power: "128", torque: "17.5", efficiency: "10.5" },
  ],
  "봉고 프론티어 J3": [
    { grade: "1톤 디젤 카고", price: 880, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.5" },
    { grade: "1톤 디젤 더블캡", price: 980, engine: "2.5 디젤", power: "82", torque: "17.5", efficiency: "10.0" },
  ],
  "카니발 GQ": [
    { grade: "2.5 V6 가솔린", price: 1980, engine: "2.5 V6 가솔린", power: "175", torque: "22.5", efficiency: "8.5" },
    { grade: "2.9 디젤", price: 2080, engine: "2.9 J 디젤", power: "126", torque: "29.0", efficiency: "10.5" },
  ],
  "슈마": [
    { grade: "1.5 DOHC", price: 880, engine: "1.5 DOHC 가솔린", power: "108", torque: "13.5", efficiency: "13.0" },
    { grade: "1.8 DOHC", price: 980, engine: "1.8 DOHC 가솔린", power: "138", torque: "16.5", efficiency: "11.5" },
  ],
  "파크타운": [
    { grade: "2.0 가솔린", price: 1180, engine: "2.0 가솔린", power: "139", torque: "18.0", efficiency: "10.0" },
    { grade: "2.0 디젤", price: 1280, engine: "2.0 디젤", power: "82", torque: "20.5", efficiency: "13.0" },
  ],
  "카렌스 RS": [
    { grade: "1.8", price: 1080, engine: "1.8 가솔린", power: "126", torque: "16.5", efficiency: "11.5" },
    { grade: "2.0 LPG", price: 1180, engine: "2.0 LPG", power: "115", torque: "17.0", efficiency: "8.5" },
  ],
  "엑스트렉": [
    { grade: "2.0 디젤", price: 1980, engine: "2.0 CRDi 디젤", power: "112", torque: "26.0", efficiency: "11.5" },
    { grade: "2.7 V6", price: 2280, engine: "2.7 V6 가솔린", power: "175", torque: "25.0", efficiency: "8.5" },
  ],
  "카렌스 RP": [
    { grade: "2.0 LPi", price: 1880, engine: "2.0 LPi", power: "150", torque: "19.6", efficiency: "8.6" },
    { grade: "1.7 디젤", price: 2080, engine: "1.7 e-VGT 디젤", power: "141", torque: "33.0", efficiency: "13.5" },
  ],
  "스토닉 YB": [
    { grade: "트렌디", price: 1685, engine: "1.4 MPI 가솔린", power: "100", torque: "13.6", efficiency: "13.0" },
    { grade: "프레스티지", price: 1985, engine: "1.4 MPI 가솔린", power: "100", torque: "13.6", efficiency: "13.0" },
    { grade: "노블레스", price: 2125, engine: "1.4 MPI 가솔린", power: "100", torque: "13.6", efficiency: "13.0" },
  ],

  // ===== 제네시스 =====
  "제네시스 BH": [
    { grade: "G330", price: 4590, engine: "3.3 V6 람다", power: "262", torque: "32.0", efficiency: "9.6" },
    { grade: "G380", price: 5290, engine: "3.8 V6 람다", power: "290", torque: "36.5", efficiency: "9.0" },
    { grade: "G500 V8 타우", price: 6790, engine: "5.0 V8 타우", power: "430", torque: "52.0", efficiency: "7.5" },
  ],

  // ===== KG모빌리티 =====
  "무쏘 Q201": [
    { grade: "K1 디젤 4WD", price: 3095, engine: "2.2 디젤", power: "202", torque: "45.9", efficiency: "10.5" },
    { grade: "K2 디젤 4WD", price: 3395, engine: "2.2 디젤", power: "202", torque: "45.9", efficiency: "10.5" },
  ],
  "코란도 스포츠 Q150": [
    { grade: "CX5 디젤 4WD", price: 2280, engine: "2.0 e-XDi 디젤", power: "155", torque: "36.7", efficiency: "10.5" },
    { grade: "CX7 디젤 4WD", price: 2580, engine: "2.0 e-XDi 디젤", power: "155", torque: "36.7", efficiency: "10.5" },
  ],
  "티볼리 에어 X150": [
    { grade: "TX 가솔린", price: 1862, engine: "1.6 e-XGi 가솔린", power: "126", torque: "16.0", efficiency: "12.0" },
    { grade: "VX 디젤", price: 2273, engine: "1.6 e-XDi 디젤", power: "115", torque: "30.6", efficiency: "14.5" },
  ],
  "코란도 훼미리 CJ": [
    { grade: "2.3 디젤", price: 1380, engine: "2.3 디젤", power: "75", torque: "16.0", efficiency: "11.5" },
    { grade: "2.9 디젤", price: 1580, engine: "2.9 디젤", power: "95", torque: "20.0", efficiency: "10.5" },
  ],
  "액티언 스포츠 Q100": [
    { grade: "2.0 디젤 4WD", price: 1880, engine: "2.0 XDi 디젤", power: "141", torque: "31.6", efficiency: "10.5" },
    { grade: "2.0 디젤 더블캡", price: 1980, engine: "2.0 XDi 디젤", power: "141", torque: "31.6", efficiency: "10.0" },
  ],
  "렉스턴 Y290": [
    { grade: "RJ7 디젤 4WD", price: 3580, engine: "2.7 디젤", power: "186", torque: "40.8", efficiency: "10.0" },
    { grade: "RX7 디젤 4WD", price: 4080, engine: "2.7 디젤", power: "186", torque: "40.8", efficiency: "10.0" },
  ],
  "렉스턴 W Y280": [
    { grade: "RX5 디젤", price: 3290, engine: "2.0 e-XDi 디젤", power: "155", torque: "36.7", efficiency: "11.0" },
    { grade: "RX7 디젤 4WD", price: 3990, engine: "2.0 e-XDi 디젤", power: "155", torque: "36.7", efficiency: "10.5" },
  ],
  "무쏘 FJ": [
    { grade: "2.3 디젤", price: 1880, engine: "2.3 디젤", power: "77", torque: "15.0", efficiency: "10.5" },
    { grade: "2.9 디젤", price: 2180, engine: "2.9 디젤", power: "120", torque: "24.5", efficiency: "10.0" },
    { grade: "3.2 가솔린", price: 2480, engine: "3.2 직렬6 가솔린", power: "220", torque: "31.0", efficiency: "7.5" },
  ],
  "이스타나 MB100": [
    { grade: "9인승 디젤", price: 1380, engine: "2.9 디젤", power: "95", torque: "20.0", efficiency: "10.5" },
    { grade: "15인승 디젤", price: 1580, engine: "2.9 디젤", power: "95", torque: "20.0", efficiency: "10.0" },
  ],

  // ===== 르노코리아 =====
  "SM5 EX1": [
    { grade: "2.0 SE", price: 1880, engine: "2.0 가솔린", power: "133", torque: "18.5", efficiency: "10.5" },
    { grade: "2.0 LE", price: 2080, engine: "2.0 가솔린", power: "133", torque: "18.5", efficiency: "10.5" },
    { grade: "2.5 V6", price: 2480, engine: "2.5 V6 가솔린", power: "170", torque: "23.0", efficiency: "9.5" },
  ],
  "조에 ZE40": [
    { grade: "ZEN", price: 3995, engine: "전기모터", power: "108", torque: "22.9", efficiency: "5.5km/kWh" },
    { grade: "INTENS", price: 4395, engine: "전기모터", power: "108", torque: "22.9", efficiency: "5.5km/kWh" },
  ],

  // ===== 쉐보레 =====
  "이쿼녹스 NAU": [
    { grade: "LT", price: 3450, engine: "1.5 가솔린 터보", power: "175", torque: "27.0", efficiency: "10.5" },
    { grade: "RS", price: 3850, engine: "1.5 가솔린 터보", power: "175", torque: "27.0", efficiency: "10.5" },
  ],
  "캡티바 3세대": [
    { grade: "LS 디젤 5인승", price: 2666, engine: "2.0 디젤", power: "150", torque: "32.7", efficiency: "12.5" },
    { grade: "LT 디젤 7인승", price: 3107, engine: "2.0 디젤", power: "150", torque: "32.7", efficiency: "12.0" },
  ],
};

function findBlock(src: string, name: string): { start: number; end: number; body: string } | null {
  const marker = `export const ${name} = `;
  const start = src.indexOf(marker);
  if (start === -1) return null;
  const open = src.indexOf("{", start);
  let depth = 0;
  let end = -1;
  for (let j = open; j < src.length; j++) {
    if (src[j] === "{") depth++;
    else if (src[j] === "}") {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  if (end === -1) return null;
  return { start: open, end, body: src.substring(open, end) };
}

function escapeForJsonKey(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatGradeArray(grades: Grade[]): string {
  const lines = grades.map((g) => {
    return (
      "    {\n" +
      `      "grade": ${JSON.stringify(g.grade)},\n` +
      `      "price": ${g.price},\n` +
      `      "engine": ${JSON.stringify(g.engine)},\n` +
      `      "power": ${JSON.stringify(g.power)},\n` +
      `      "torque": ${JSON.stringify(g.torque)},\n` +
      `      "efficiency": ${JSON.stringify(g.efficiency)}\n` +
      "    }"
    );
  });
  return "[\n" + lines.join(",\n") + "\n  ]";
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`[mode] ${apply ? "APPLY" : "DRY-RUN"}`);

  let src = fs.readFileSync(FILE, "utf8");
  const block = findBlock(src, "CAR_GRADES");
  if (!block) {
    console.error("CAR_GRADES 블록을 찾을 수 없음");
    process.exit(1);
  }
  let body = block.body;

  let added = 0;
  let skipped = 0;
  for (const [key, grades] of Object.entries(NEW_GRADES)) {
    const exists = new RegExp(`"${escapeForJsonKey(key)}":\\s*\\[`).test(body);
    if (exists) {
      console.log(`  [SKIP - already exists] "${key}"`);
      skipped++;
      continue;
    }
    // Insert before the closing "}" of CAR_GRADES
    const lastBrace = body.lastIndexOf("}");
    if (lastBrace === -1) throw new Error("invalid block");
    const before = body.substring(0, lastBrace).replace(/\s*$/, "");
    const after = body.substring(lastBrace);
    const sep = before.endsWith("{") ? "\n" : ",\n";
    const insertion = `${sep}  "${key}": ${formatGradeArray(grades)}\n`;
    body = before + insertion + after;
    console.log(`  [ADD] "${key}" (${grades.length} grades)`);
    added++;
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  added:   ${added}`);
  console.log(`  skipped: ${skipped}`);

  if (!apply) {
    console.log(`\n[dry-run] --apply 추가 시 catalog_data.ts에 반영합니다.`);
    return;
  }

  const newSrc = src.substring(0, block.start) + body + src.substring(block.end);
  fs.writeFileSync(FILE, newSrc, "utf8");
  console.log(`\n[apply] 완료: ${FILE} 갱신`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
