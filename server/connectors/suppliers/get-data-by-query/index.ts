import { AggregationCursor, Document, ObjectId } from "mongodb";
import { Supplier } from "../../../interfaces/supplier";

import { collections } from "../../../plugins/connections";

export async function getSupplierDataByQuery(query: {
  _id?: ObjectId
  start_date?: Date
  end_date?: Date
}): Promise<Supplier[]> {
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

  const payload: Supplier[] = []
  const cursor: AggregationCursor<Supplier> = collections.suppliers.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload
}