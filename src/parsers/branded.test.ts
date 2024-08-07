import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseBrandedDef } from '..'
import { assert } from '../_utils'

describe('objects', () => {
  test('should be possible to use branded string', () => {
    const schema = z.string().brand<'x'>()
    const parsedSchema = parseBrandedDef(schema._def, getRefs())

    const expectedSchema = {
      type: 'string'
    }
    assert(parsedSchema, expectedSchema)
  })
})
