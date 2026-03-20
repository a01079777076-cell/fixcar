import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * 개인정보 암호화 유틸 (AES-256-GCM)
 * 전화번호, 주민번호 등 민감 정보 암호화용
 * 
 * 환경변수 필요: ENCRYPTION_KEY (32바이트 hex, 64자)
 * 생성: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    console.warn("[보안 경고] ENCRYPTION_KEY가 설정되지 않았거나 길이가 잘못됨. 기본키 사용 (프로덕션에서 반드시 변경!)");
    /* 개발용 기본키 - 프로덕션에서는 환경변수 필수 */
    return Buffer.from("fixcar2025defaultencryptionkey!!", "utf-8");
  }
  return Buffer.from(key, "hex");
}

/** 암호화 */
export function encrypt(text: string): string {
  if (!text) return "";
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  
  /* iv:tag:encrypted 형태로 저장 */
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

/** 복호화 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;
  
  try {
    const key = getKey();
    const [ivHex, tagHex, encrypted] = encryptedText.split(":");
    
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch {
    /* 복호화 실패 = 암호화 안 된 원문일 수 있음 */
    return encryptedText;
  }
}

/** 전화번호 마스킹 (010-****-1234) */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  return phone;
}

/** 이메일 마스킹 (abc***@fixcar.kr) */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 3);
  return `${visible}***@${domain}`;
}
