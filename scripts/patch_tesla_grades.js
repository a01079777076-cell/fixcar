// ═══════════════════════════════════════════════════
// 📁 실행 방법: node scripts/patch_tesla_grades.js
// 📁 저장 경로: scripts/patch_tesla_grades.js
// ═══════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'catalog_data.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 기존 모델 Y 등급 데이터 교체
const oldModelY = `"모델 Y": [
    {
      "grade": "RWD 스탠다드",
      "price": 4990,
      "engine": "전기모터",
      "power": "283",
      "torque": "42.3",
      "efficiency": "5.5"
    },
    {
      "grade": "Long Range AWD",
      "price": 5990,
      "engine": "전기모터 듀얼",
      "power": "346",
      "torque": "49.0",
      "efficiency": "5.1"
    },
    {
      "grade": "Performance",
      "price": 6990,
      "engine": "전기모터 듀얼",
      "power": "514",
      "torque": "66.4",
      "efficiency": "4.4"
    }
  ]`;

const newModelY = `"모델 Y": [
    {
      "grade": "RWD",
      "price": 4690,
      "engine": "전기모터 (후륜)",
      "power": "283",
      "torque": "42.3",
      "efficiency": "5.5"
    },
    {
      "grade": "프리미엄 RWD",
      "price": 4990,
      "engine": "전기모터 (후륜)",
      "power": "283",
      "torque": "42.3",
      "efficiency": "5.5"
    },
    {
      "grade": "스탠다드 레인지 RWD",
      "price": 4490,
      "engine": "전기모터 (후륜)",
      "power": "255",
      "torque": "42.3",
      "efficiency": "5.8"
    },
    {
      "grade": "롱 레인지 AWD",
      "price": 5690,
      "engine": "전기모터 듀얼 (AWD)",
      "power": "346",
      "torque": "49.0",
      "efficiency": "5.1"
    },
    {
      "grade": "프리미엄 롱 레인지 AWD",
      "price": 5990,
      "engine": "전기모터 듀얼 (AWD)",
      "power": "346",
      "torque": "49.0",
      "efficiency": "5.1"
    },
    {
      "grade": "퍼포먼스 AWD",
      "price": 6990,
      "engine": "전기모터 듀얼 (AWD)",
      "power": "514",
      "torque": "66.4",
      "efficiency": "4.4"
    }
  ]`;

if (content.includes(oldModelY)) {
  content = content.replace(oldModelY, newModelY);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ 테슬라 모델 Y 등급 업데이트 완료! (6개 등급)');
} else {
  console.log('⚠️ 기존 모델 Y 등급 패턴을 찾을 수 없습니다. 수동 확인 필요.');
  console.log('data/catalog_data.ts 에서 "모델 Y" 등급 섹션을 확인해주세요.');
}
