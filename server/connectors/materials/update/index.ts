import { UpdateResult } from "mongodb"

import { collections } from "../../../plugins/connections"
import { Material } from "../../../interfaces/material"

export async function updateMaterial(data: Material): Promise<UpdateResult> {
  const result: UpdateResult = await collections.materials.updateOne({ _id: data._id }, { $set: { ...data } })
  return result
}