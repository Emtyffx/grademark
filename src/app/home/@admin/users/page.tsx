"use server";

import User, { IUser } from "@/lib/models/User";
import { Client } from "./client";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    roles?: string;
    email?: string;
    name?: string;
  }>;
}

function serializeUserForDisplay(user: IUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

interface Filters {
  name?: any;
  email?: any;
  role?: any;
}

export default async function AdminsPage({ searchParams }: PageProps) {
  const perPage = 10;
  const params = await searchParams;
  const page = Math.max(+(params.page || 1), 1);
  const name = params.name;
  const email = params.email;
  const roles = !!params.roles ? params.roles.split(",") : [];
  const filters: Filters = {};
  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }
  if (email) {
    filters.email = { $regex: email, $options: "i" };
  }
  console.log(roles);
  if (roles && roles.length > 0) {
    filters.role = { $in: roles };
  }
  const userCount = await User.countDocuments(filters);
  const users = await User.find(filters)
    .skip(perPage * (page - 1))
    .limit(perPage)
    .exec();

  const pageCount = Math.ceil(userCount / perPage);
  return (
    <Client
      data={users.map(serializeUserForDisplay)}
      page={page || 1}
      pageCount={pageCount}
    />
  );
}
