"use server";

import { revalidatePath } from "next/cache";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateOne,
} from "./auth";
import { redirect } from "next/navigation";

export async function logout() {
  const session = await getCurrentSession();
  if (!session) return null;
  await invalidateOne(session.id);
  await deleteSessionTokenCookie();
  revalidatePath("/");
  return redirect("/");
}
