import { getCurrentSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getCurrentSession();
  if (session) {
    return redirect("/home");
  }
  return (
    <div>
      Hello{" "}
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
