import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getCurrentSession();
  if (session) {
    return redirect("/home");
  }
  return <div>Hello</div>;
}
