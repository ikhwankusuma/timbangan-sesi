import { InsertOneResult, ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { MaterialBase, Material } from "../../../interfaces/material";

export async function createMaterial(data: MaterialBase): Promise<InsertOneResult> {
  const payload: Material = {
    ...data,
    _id: new ObjectId()
  }
  const result: InsertOneResult = await collections.materials.insertOne(payload)
  return result
}