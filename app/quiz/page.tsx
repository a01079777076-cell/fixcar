// 📁 저장 경로: app/quiz/page.tsx
// /quiz → /quiz-select 리다이렉트 (경로 통일)
import { redirect } from "next/navigation";
export default function QuizRedirect() { redirect("/quiz-select"); }
