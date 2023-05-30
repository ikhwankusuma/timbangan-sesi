import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Source } from "../../../interfaces/source"

import { collections } from "../../../plugins/connections"

export async function deleteSourceByQuery(query?: { _id?: ObjectId[], unique_name?: string[], type?: Source['type'], license?: string[] }): Promise<DeleteResult> {
  const filter: Filter<Source> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }
  if (query.unique_name?.length) {
    filter.unique_name = { $in: query.unique_name }
  }
  if (query.type?.length) {
    filter.type = query.type
  }
  if (query.license?.length) {
    filter.license = { $in: query.license }
  }

  const result: DeleteResult = await collections.sources.deleteMany(filter)
  return result
}