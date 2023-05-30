import { collections } from "../../../plugins/connections";
import { Supplier } from "../../../interfaces/supplier";

export async function findSupplierByName(name: string): Promise<Supplier> {
  const result: Supplier = await collections.suppliers.findOne({ unique_name: name }) as Supplier
  return result
}