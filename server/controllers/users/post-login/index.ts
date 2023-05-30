import { Request, Response } from 'express'
import { pbkdf2Sync } from 'crypto'

import { generateAccessToken, generateRefreshToken } from '../../../plugins/tokens'
import { errorHandler } from '../../../plugins/errors'
import { findUserByUsername } from '../../../connectors/users/find-by-username'
import { getUserDataById } from '../../../connectors/users/get-data-by-id'
import { User, UserResponse } from '../../../interfaces/user'

export async function userPostLoginController(req: Request, res: Response) {
  try {
    const {
      body: {
        username,
        password
      }
    }: {
      body: {
        username: string
        password: string
      }
    } = req

    const user: User = await findUserByUsername(username)
    if (!user) throw new Error('INVALID_COMBINATION')

    const triedPassword: string = pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
    if (triedPassword !== user.password) throw new Error('INVALID_COMBINATION')

    const payload: Request['user'] = {
      _id: user._id,
      role: user.role,
      name: user.name
    }
    const atk: string = generateAccessToken(payload)
    const rtk: string = generateRefreshToken(payload)

    const userData: UserResponse = await getUserDataById(user._id)

    res.status(200).send({ atk, rtk, user: userData })
  } catch (e) {
    errorHandler(e, res)
  }
}