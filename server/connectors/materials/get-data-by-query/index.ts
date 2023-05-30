import { AggregationCursor, Document, ObjectId } from "mongodb";
import { Material } from "../../../interfaces/material";

import { collections } from "../../../plugins/connections";

export async function getMaterialDataByQuery(query: {
  _id?: ObjectId
  start_date?: Date
  end_date?: Date
}): Promise<Material[]> {
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

  const payload: Material[] = []
  const cursor: AggregationCursor<Material> = collections.materials.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload
}