import { getCurrentSession } from "@/lib/auth";

export default async function Layout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (session?.user.role == "admin") {
    return admin;
  }
  return children;
}
