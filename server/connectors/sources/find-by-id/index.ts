import { ObjectId } from "mongodb";

import { collections } from "../../../plugins/connections";
import { Source } from "../../../interfaces/source";

export async function findSourceById(_id: ObjectId): Promise<Source> {
  const result: Source = await collections.sources.findOne({ _id }) as Source
  return result
}