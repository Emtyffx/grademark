import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Client } from "./client";

export default async function RegisterPage() {
  const session = await getCurrentSession();
  if (session) return redirect("/");
  return <Client />;
}
