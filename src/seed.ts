import "dotenv/config";
import { connectToDatabase } from "./lib/mongoose";
import { faker } from "@faker-js/faker";
import User from "./lib/models/User";

(async () => {
  console.log(process.env.MONGO_URI);
  await connectToDatabase(process.env.MONGO_URI);

  for (let i = 0; i < 100; i++) {
    const user = new User({
      name: faker.person.fullName({
        lastName: "Whiskas",
      }),
      email: faker.internet.email(),
      role: "teacher",
      hashedPass: "test",
    });

    await user.save();
  }
})();
