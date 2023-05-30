import { collections } from "../../../plugins/connections";
import { Customer } from "../../../interfaces/customer";

export async function findCustomerByName(name: string): Promise<Customer> {
  const result: Customer = await collections.customers.findOne({ unique_name: name }) as Customer
  return result
}