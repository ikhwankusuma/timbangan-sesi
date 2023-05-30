import { AggregationCursor, Document, ObjectId } from "mongodb";
import { Customer } from "../../../interfaces/customer";

import { collections } from "../../../plugins/connections";

export async function getCustomerDataByQuery(query: {
  _id?: ObjectId
  start_date?: Date
  end_date?: Date
}): Promise<Customer[]> {
  const pipeline: Document[] = [
    {
      $match: {
        $expr: {
          $and: []
        }
      }
    },
  ]

  if (query._id) {
    pipeline[0].$match.$expr.$and.push({
      $eq: ['$_id', query._id]
    })
  }
  if (query.start_date) {
    pipeline[0].$match.$expr.$and.push({
      $gte: [
        '$create_date',
        {
          $toDate: query.start_date
        }
      ]
    })
    if (query.end_date) {
      pipeline[0].$match.$expr.$and.push({
        $lte: [
          '$create_date',
          {
            $toDate: query.end_date
          }
        ]
      })
    }
  }

  const payload: Customer[] = []
  const cursor: AggregationCursor<Customer> = collections.customers.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload
}