import { collections } from "../../../plugins/connections";
import { User } from "../../../interfaces/user";

export async function findUserByUsername(username: string): Promise<User> {
  const result: User = await collections.users.findOne({ username }) as User
  return result
}