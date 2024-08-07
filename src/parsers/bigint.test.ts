import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseBigintDef } from '..'
import { assert } from '../_utils'

describe('bigint', () => {
  test('should be possible to use bigint', () => {
    const parsedSchema = parseBigintDef(z.bigint()._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'integer',
      format: 'int64'
    }
    assert(parsedSchema, jsonSchema)
  })

  // Jest doesn't like bigints. 🤷
  test('should be possible to define gt/lt', () => {
    const parsedSchema = parseBigintDef(
      z.bigint().gte(BigInt(10)).lte(BigInt(20))._def,
      getRefs()
    )
    const jsonSchema = {
      type: 'integer',
      format: 'int64',
      minimum: BigInt(10),
      maximum: BigInt(20)
    }
    assert(parsedSchema, jsonSchema)
  })
})
