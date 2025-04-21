import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGO_URI: z.string().url(),
  },
  client: {},
  runtimeEnv: {
    MONGO_URI: process.env.MONGO_URI,
  },
});
