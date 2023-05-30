import { ObjectId, DeleteResult, Filter } from "mongodb"
import { User } from "../../../interfaces/user"

import { collections } from "../../../plugins/connections"

export async function deleteUserByQuery(query?: { _id?: ObjectId[], username?: string[] }): Promise<DeleteResult> {
  const filter: Filter<User> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }
  if (query.username?.length) {
    filter.username = { $in: query.username }
  }

  const result: DeleteResult = await collections.users.deleteMany(filter)
  return result
}