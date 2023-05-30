import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Material } from "../../../interfaces/material"

import { collections } from "../../../plugins/connections"

export async function deleteMaterialByQuery(query?: { _id?: ObjectId[], unique_name?: string[] }): Promise<DeleteResult> {
  const filter: Filter<Material> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }
  if (query.unique_name?.length) {
    filter.unique_name = { $in: query.unique_name }
  }

  const result: DeleteResult = await collections.materials.deleteMany(filter)
  return result
}