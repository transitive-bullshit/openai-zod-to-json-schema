import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseSetDef } from '..'
import { assert } from '../_utils'
import { errorReferences } from './error-references.js'

describe('set', () => {
  test("should include min and max size error messages if they're passed.", () => {
    const minSizeError = 'Set must have at least 5 elements'
    const maxSizeError = "Set can't have more than 10 elements"
    const errs = {
      minItems: minSizeError,
      maxItems: maxSizeError
    }
    const jsonSchema: JSONSchema7Type = {
      type: 'array',
      minItems: 5,
      maxItems: 10,
      errorMessage: errs,
      uniqueItems: true,
      items: {}
    }
    const zodSchema = z.set(z.any()).min(5, minSizeError).max(10, maxSizeError)
    const jsonParsedSchema = parseSetDef(zodSchema._def, errorReferences())
    assert(jsonParsedSchema, jsonSchema)
  })
  test('should not include error messages if none are passed', () => {
    const jsonSchema: JSONSchema7Type = {
      type: 'array',
      minItems: 5,
      maxItems: 10,
      uniqueItems: true,
      items: {}
    }
    const zodSchema = z.set(z.any()).min(5).max(10)
    const jsonParsedSchema = parseSetDef(zodSchema._def, errorReferences())
    assert(jsonParsedSchema, jsonSchema)
  })
  test("should not include error messages if it's not explicitly set to true in the References constructor", () => {
    const zodSchema = z.set(z.any()).min(1, 'bad').max(5, 'vbad')
    const jsonParsedSchema = parseSetDef(zodSchema._def, getRefs())
    assert(jsonParsedSchema.errorMessage, undefined)
  })
})
