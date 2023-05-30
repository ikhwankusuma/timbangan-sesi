import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Event } from "../../../interfaces/event"

import { collections } from "../../../plugins/connections"

export async function deleteEventByQuery(query?: { _id?: ObjectId[] }): Promise<DeleteResult> {
  const filter: Filter<Event> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }

  const result: DeleteResult = await collections.events.deleteMany(filter)
  return result
}