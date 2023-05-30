import { ObjectId, DeleteResult, Filter } from "mongodb"
import { Customer } from "../../../interfaces/customer"

import { collections } from "../../../plugins/connections"

export async function deleteCustomerByQuery(query?: { _id?: ObjectId[], unique_name?: string[] }): Promise<DeleteResult> {
  const filter: Filter<Customer> = {}

  if (query._id?.length) {
    filter._id = { $in: query._id }
  }
  if (query.unique_name?.length) {
    filter.unique_name = { $in: query.unique_name }
  }

  const result: DeleteResult = await collections.customers.deleteMany(filter)
  return result
}