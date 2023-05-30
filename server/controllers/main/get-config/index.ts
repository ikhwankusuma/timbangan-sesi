import path from 'path'
import { verify } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { readFile } from 'fs/promises'

import { errorHandler } from '../../../plugins/errors'
import { Config } from '../../../interfaces/general'

export async function mainGetConfigController(req: Request, res: Response) {
  try {
    const rawToken: string = await readFile(path.join(__dirname, '../../../../config.json'), 'utf-8')
    const objToken: { token: string } = JSON.parse(rawToken)

    if (!objToken?.token) throw new Error('NO_CONFIG')

    const publicKey: string = await readFile(path.join(__dirname, '../../../../keys/public.pem'), 'utf-8')

    const token: string = objToken.token
    const config: Config = verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'SwiftDesign',
      audience: process.env.BASE_URL || 'http://localhost:8000'
    }) as Config

    res.status(200).send(config)
  } catch (e: any) {
    if (e.message || 'NO_CONFIG' || e.message.includes('ENOENT'))
      return res.status(200).send('NO_CONFIG')
    errorHandler(e, res)
  }
}