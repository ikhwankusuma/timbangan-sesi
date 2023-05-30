import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Supplier } from "../../../interfaces/supplier"

import { collections } from "../../../plugins/connections"

export async function deleteSupplierByQuery(query?: { _id?: ObjectId[], unique_name?: string[] }): Promise<DeleteResult> {
  const filter: Filter<Supplier> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }
  if (query.unique_name?.length) {
    filter.unique_name = { $in: query.unique_name }
  }

  const result: DeleteResult = await collections.suppliers.deleteMany(filter)
  return result
}