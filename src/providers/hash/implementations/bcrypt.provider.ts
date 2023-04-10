import { compare as bcryptCompare, hash as bcryptHash } from 'bcryptjs'

import { IComparable } from '../contracts/comparable'
import { IHashable } from '../contracts/hashable'

export class BCryptJSHashProvider implements IHashable, IComparable {
  async hash(s: string, salt: number): Promise<string> {
    return bcryptHash(s, salt)
  }

  async compare(target: string, hash: string): Promise<boolean> {
    return bcryptCompare(target, hash)
  }
}
