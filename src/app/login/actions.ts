"use server";
import {
  createSession,
  generateToken,
  getCurrentSession,
  hash,
  setSessionTokenCookie,
} from "@/lib/auth";
import { loginValidator } from "./validators";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";

export async function login(props: { email: string; password: string }) {
  if (await getCurrentSession()) {
    return {
      message: "Already loginned",
      error: true,
    };
  }
  const validationResult = loginValidator.safeParse(props);
  if (!validationResult.success) {
    return {
      message: "Incorrect input data",
      error: true,
    };
  }

  try {
    const { email, password } = validationResult.data;
    const user = await User.findOne({ email });
    if (!user || user.hashedPass != hash(password)) {
      return {
        message: "Incorrect email or password",
        error: true,
      };
    }
    const token = generateToken();
    const newSession = await createSession(token, user.id);
    if (!newSession) throw new Error("Error creating session");
    setSessionTokenCookie(token, newSession?.expiresAt);
    return revalidatePath("/");
  } catch (error) {
    console.log("Internal error: ", error);
  }
}
