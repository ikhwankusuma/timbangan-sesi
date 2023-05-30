import { AggregationCursor, Document, ObjectId } from "mongodb";
import { UserResponse } from "../../../interfaces/user";

import { collections } from "../../../plugins/connections";

export async function getUserDataById(_id: ObjectId): Promise<UserResponse> {
  const pipeline: Document[] = [
    {
      $match: {
        $expr: {
          $eq: ['$_id', _id]
        }
      }
    },
  ]

  pipeline.push({
    $project: {
      _id: '$_id',
      name: '$name',
      username: '$username',
      role: '$role',
    }
  })

  const payload: UserResponse[] = []
  const cursor: AggregationCursor<UserResponse> = collections.users.aggregate(pipeline)
  for await (const doc of cursor) {
    payload.push(doc)
  }

  return payload[0]
}