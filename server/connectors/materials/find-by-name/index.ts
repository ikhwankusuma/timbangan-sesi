import { collections } from "../../../plugins/connections";
import { Material } from "../../../interfaces/material";

export async function findMaterialByName(name: string): Promise<Material> {
  const result: Material = await collections.materials.findOne({ unique_name: name }) as Material
  return result
}