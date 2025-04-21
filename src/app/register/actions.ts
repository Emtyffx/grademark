"use server";

import {
  createSession,
  generateToken,
  getCurrentSession,
  hash,
  setSessionTokenCookie,
} from "@/lib/auth";
import { registerValidator } from "./validators";
import User from "@/lib/models/User";
import { revalidatePath } from "next/cache";
export async function register(props: {
  email: string;
  password: string;
  name: string;
}) {
  if (await getCurrentSession()) {
    return {
      message: "Already loginned",
      error: true,
    };
  }
  const validationResult = registerValidator.safeParse(props);
  if (!validationResult.success) {
    return {
      message: "Incorrect input data",
      error: true,
    };
  }

  const { email, name, password } = validationResult.data;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return {
        message: "User with this email already exists",
        error: true,
      };
    }

    const newUser = new User({
      email,
      name,
      hashedPass: hash(password),
    });
    await newUser.save();

    const token = generateToken();
    const newSession = await createSession(token, newUser.id);
    if (!newSession) throw new Error("error creating session");
    setSessionTokenCookie(token, newSession.expiresAt);
  } catch (error) {
    console.error("Internal error: ", error);
  }

  return revalidatePath("/");
}
