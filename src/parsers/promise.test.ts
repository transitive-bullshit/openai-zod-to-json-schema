import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parsePromiseDef } from '..'
import { assert } from '../_utils'

describe('promise', () => {
  test('should be possible to use promise', () => {
    const parsedSchema = parsePromiseDef(z.promise(z.string())._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string'
    }
    assert(parsedSchema, jsonSchema)
  })
})
