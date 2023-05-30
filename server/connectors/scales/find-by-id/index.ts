import { ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { Scale } from "../../../interfaces/scale";

export async function findScaleById(_id: ObjectId): Promise<Scale> {
  const result: Scale = await collections.scales.findOne({ _id }) as Scale
  return result
}