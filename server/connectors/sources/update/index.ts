import { UpdateResult } from "mongodb"

import { collections } from "../../../plugins/connections"
import { Source } from "../../../interfaces/source"

export async function updateSource(data: Source): Promise<UpdateResult> {
  const result: UpdateResult = await collections.sources.updateOne({ _id: data._id }, { $set: { ...data } })
  return result
}