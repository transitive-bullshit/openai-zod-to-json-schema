import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseTupleDef } from '..'
import { assert } from '../_utils'

describe('objects', () => {
  test('should be possible to describe a simple tuple schema', () => {
    const schema = z.tuple([z.string(), z.number()])

    const parsedSchema = parseTupleDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
      minItems: 2,
      maxItems: 2
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should be possible to describe a tuple schema with rest()', () => {
    const schema = z.tuple([z.string(), z.number()]).rest(z.boolean())

    const parsedSchema = parseTupleDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
      minItems: 2,
      additionalItems: {
        type: 'boolean'
      }
    }
    assert(parsedSchema, expectedSchema)
  })
})
