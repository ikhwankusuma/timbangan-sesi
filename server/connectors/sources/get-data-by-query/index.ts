import { AggregationCursor, Document, ObjectId } from "mongodb";
import { Source } from "../../../interfaces/source";

import { collections } from "../../../plugins/connections";

export async function getSourceDataByQuery(query: {
  _id?: ObjectId
  start_date?: Date
  end_date?: Date
}): Promise<Source[]> {
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

  const payload: Source[] = []
  const cursor: AggregationCursor<Source> = collections.sources.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload
}