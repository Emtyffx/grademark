import { getCurrentSession } from "@/lib/auth";

export default async function Layout({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
}) {
  return <>{admin}</>;
}
