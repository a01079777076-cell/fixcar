import { redirect } from "next/navigation";

/* 하드코딩 이벤트(실제 진행 안 함) 제거 — 관리자가 등록한 DB 이벤트는 /events */
export default function EventPage() {
  redirect("/events");
}
