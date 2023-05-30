import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Scale } from "../../../interfaces/scale"

import { collections } from "../../../plugins/connections"

export async function deleteScaleByQuery(query?: { _id?: ObjectId[] }): Promise<DeleteResult> {
  const filter: Filter<Scale> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }

  const result: DeleteResult = await collections.scales.deleteMany(filter)
  return result
}