import { Request, Response } from 'express'
import { ObjectId, UpdateResult } from 'mongodb'

import { UserBody, User } from '../../../interfaces/user'
import { errorHandler } from '../../../plugins/errors'
import { verifyAction } from '../../../plugins/authentication'
import { findUserById } from '../../../connectors/users/find-by-id'
import { updateUser } from '../../../connectors/users/update'

export async function userPutController(req: Request, res: Response) {
  try {
    const {
      params: {
        _id
      },
      body: {
        name,
        password
      },
      user
    }: {
      params: {
        _id?: string
      },
      body: UserBody,
      user?: Request['user']
    } = req
    if (!await verifyAction(user, 'user-put')) throw new Error('UNAUTHORIZED')

    const issuer: User = await findUserById(new ObjectId(_id))
    if (!issuer) throw new Error('USER_NOT_FOUND')

    if (name && typeof name === 'string') issuer.name === name
    if (password && (typeof password !== 'string' || password.length < 8)) issuer.password = password

    const { modifiedCount }: UpdateResult = await updateUser(issuer)
    if (!modifiedCount) throw new Error('USER_NOT_UPDATED')

    res.status(200).send(issuer)
  } catch (e) {
    errorHandler(e, res)
  }
}