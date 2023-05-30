import { UpdateResult } from "mongodb"

import { collections } from "../../../plugins/connections"
import { Scale } from "../../../interfaces/scale"

export async function updateScale(data: Scale): Promise<UpdateResult> {
  const result: UpdateResult = await collections.scales.updateOne({ _id: data._id }, { $set: { ...data } })
  return result
}