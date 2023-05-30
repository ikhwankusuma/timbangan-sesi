import { collections } from "../../../plugins/connections";
import { Source } from "../../../interfaces/source";

export async function findSourceByName(name: string): Promise<Source> {
  const result: Source = await collections.sources.findOne({ unique_name: name }) as Source
  return result
}