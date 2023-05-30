import { InsertOneResult, ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { SourceBase, Source } from "../../../interfaces/source";

export async function createSource(data: SourceBase): Promise<InsertOneResult> {
  const payload: Source = {
    ...data,
    _id: new ObjectId()
  }
  const result: InsertOneResult = await collections.sources.insertOne(payload)
  return result
}