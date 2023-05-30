import { InsertOneResult, ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { ScaleBase, Scale } from "../../../interfaces/scale";

export async function createScale(data: ScaleBase): Promise<InsertOneResult> {
  const payload: Scale = {
    ...data,
    _id: new ObjectId()
  }
  const result: InsertOneResult = await collections.scales.insertOne(payload)
  return result
}