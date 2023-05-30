import { AggregationCursor, Document, ObjectId } from "mongodb";
import { Scale } from "../../../interfaces/scale";

import { collections } from "../../../plugins/connections";

export async function getScaleDataByQuery(query: {
  _id?: ObjectId
  limit?: number
  skip?: number
  record?: string
  start_date?: Date
  end_date?: Date
}): Promise<Scale[]> {
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
  if (query.record) {
    pipeline[0].$match.$expr.$and.push({
      $regexMatch: {
        input: '$number',
        options: 'i',
        regex: query.record
      }
    })
  }
  if (query.start_date) {
    pipeline[0].$match.$expr.$and.push({
      $gte: [
        '$start_date',
        {
          $toDate: query.start_date
        }
      ]
    })
    if (query.end_date) {
      pipeline[0].$match.$expr.$and.push({
        $lte: [
          '$start_date',
          {
            $toDate: query.end_date
          }
        ]
      })
    }
  }

  pipeline.push({
    $sort: {
      start_date: -1
    }
  })

  if (query.skip) {
    pipeline.push({
      $skip: query.skip
    })
  }
  if (query.limit) {
    pipeline.push({
      $limit: query.limit
    })
  }

  pipeline.push({
    $project: {
      number: '$number',
      customer: '$customer',
      supplier: '$supplier',
      data: {
        $reverseArray: '$data'
      },
      status: '$status',
      start_date: '$start_date',
      end_date: '$end_date',
    }
  })

  const payload: Scale[] = []
  const cursor: AggregationCursor<Scale> = collections.scales.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload
}