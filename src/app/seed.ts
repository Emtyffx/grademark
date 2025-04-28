import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongoose";
import { faker } from "@faker-js/faker";

await connectToDatabase();

for (let i = 0; i < 100; i++) {
  const user = new User({
    name: faker.person.fullName({ lastName: "Password" }),
    email: faker.internet.email(),
    hashedPass: faker.git.commitSha(),
    role: "teacher",
  });
  await user.save();
}
