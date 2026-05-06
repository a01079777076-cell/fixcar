/**
 * 카카오/일반 사용자 중 한 명을 ADMIN으로 승격.
 *
 *   목록만 보기:        npx tsx scripts/make-admin.ts
 *   ID로 ADMIN 승격:    npx tsx scripts/make-admin.ts --id=12
 *   ID로 USER 강등:     npx tsx scripts/make-admin.ts --id=12 --demote
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const idArg = args.find((a) => a.startsWith("--id="));
  const demote = args.includes("--demote");

  if (!idArg) {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        provider: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`\n총 ${users.length}명의 사용자:\n`);
    console.log("ID  | provider | role   | name             | email");
    console.log("----|----------|--------|------------------|----------------------------------");
    for (const u of users) {
      const id = String(u.id).padEnd(3);
      const provider = (u.provider || "email").padEnd(8);
      const role = u.role.padEnd(6);
      const name = (u.nickname || u.name || "").padEnd(16);
      console.log(`${id} | ${provider} | ${role} | ${name} | ${u.email}`);
    }
    console.log("\n승격 명령:  npx tsx scripts/make-admin.ts --id=<ID>\n");
    return;
  }

  const id = Number(idArg.split("=")[1]);
  if (!id || Number.isNaN(id)) {
    console.error("올바른 --id=<숫자> 를 입력하세요");
    process.exit(1);
  }

  const before = await prisma.user.findUnique({ where: { id } });
  if (!before) {
    console.error(`ID=${id} 사용자를 찾을 수 없습니다`);
    process.exit(1);
  }

  const newRole = demote ? "USER" : "ADMIN";
  const updated = await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  console.log(`\n[완료] ${before.email}`);
  console.log(`  ${before.role} -> ${updated.role}`);
  console.log(`\n주의: 기존 로그인 토큰에는 이전 role이 박혀 있으므로, 로그아웃 후 다시 로그인해야 ADMIN 권한이 활성화됩니다.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
