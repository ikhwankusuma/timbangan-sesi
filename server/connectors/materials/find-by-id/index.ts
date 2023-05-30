import { ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { Material } from "../../../interfaces/material";

export async function findMaterialById(_id: ObjectId): Promise<Material> {
  const result: Material = await collections.materials.findOne({ _id }) as Material
  return result
}