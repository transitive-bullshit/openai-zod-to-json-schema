import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseEffectsDef } from '..'
import { assert } from '../_utils'

describe('effects', () => {
  test('should be possible to use refine', () => {
    const parsedSchema = parseEffectsDef(
      z.number().refine((x) => x + 1)._def,
      getRefs(),
      false
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'number'
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should default to the input type', () => {
    const schema = z.string().transform((arg) => Number.parseInt(arg))

    const jsonSchema = parseEffectsDef(schema._def, getRefs(), false)

    assert(jsonSchema, {
      type: 'string'
    })
  })
})
