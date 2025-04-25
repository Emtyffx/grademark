"use server";

import User, { IUser } from "@/lib/models/User";
import { Client } from "./client";

interface PageProps {
  searchParams: {
    page?: number;
  };
}

function serializeUserForDisplay(user: IUser) {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export default async function AdminsPage({ searchParams }: PageProps) {
  const users = await User.find();

  return (
    <Client
      data={users.map(serializeUserForDisplay)}
      page={searchParams.page || 1}
    />
  );
}
