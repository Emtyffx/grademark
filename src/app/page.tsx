"use client";
import { useAuth } from "@/lib/context/AuthContext";
import Image from "next/image";

export default function Home() {
  const user = useAuth();
  return <div>Hello, {user?.name}</div>;
}
