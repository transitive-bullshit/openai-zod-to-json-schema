import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseDateDef } from '..'
import { assert } from '../_utils'
import { errorReferences } from './error-references.js'

describe('Date validations', () => {
  test('should be possible to date as a string type', () => {
    const zodDateSchema = z.date()
    const parsedSchemaWithOption = parseDateDef(
      zodDateSchema._def,
      getRefs({ dateStrategy: 'string' })
    )
    const parsedSchemaFromDefault = parseDateDef(zodDateSchema._def, getRefs())

    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      format: 'date-time'
    }

    assert(parsedSchemaWithOption, jsonSchema)
    assert(parsedSchemaFromDefault, jsonSchema)
  })

  test('should be possible to describe minimum date', () => {
    const zodDateSchema = z
      .date()
      .min(new Date('1970-01-02'), { message: 'Too old' })
    const parsedSchema = parseDateDef(
      zodDateSchema._def,
      getRefs({ dateStrategy: 'integer' })
    )

    const jsonSchema: JSONSchema7Type = {
      type: 'integer',
      format: 'unix-time',
      minimum: 86_400_000
    }

    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to describe maximum date', () => {
    const zodDateSchema = z.date().max(new Date('1970-01-02'))
    const parsedSchema = parseDateDef(
      zodDateSchema._def,
      getRefs({ dateStrategy: 'integer' })
    )

    const jsonSchema: JSONSchema7Type = {
      type: 'integer',
      format: 'unix-time',
      maximum: 86_400_000
    }

    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to describe both maximum and minimum date', () => {
    const zodDateSchema = z
      .date()
      .min(new Date('1970-01-02'))
      .max(new Date('1972-01-02'))
    const parsedSchema = parseDateDef(
      zodDateSchema._def,
      getRefs({ dateStrategy: 'integer' })
    )

    const jsonSchema: JSONSchema7Type = {
      type: 'integer',
      format: 'unix-time',
      minimum: 86_400_000,
      maximum: 63_158_400_000
    }

    assert(parsedSchema, jsonSchema)
  })

  test("should include custom error message for both maximum and minimum if they're passed", () => {
    const minimumErrorMessage = 'To young'
    const maximumErrorMessage = 'To old'
    const zodDateSchema = z
      .date()
      .min(new Date('1970-01-02'), minimumErrorMessage)
      .max(new Date('1972-01-02'), maximumErrorMessage)

    const parsedSchema = parseDateDef(
      zodDateSchema._def,
      errorReferences({ dateStrategy: 'integer' })
    )

    const jsonSchema: JSONSchema7Type = {
      type: 'integer',
      format: 'unix-time',
      minimum: 86_400_000,
      maximum: 63_158_400_000,
      errorMessage: {
        minimum: minimumErrorMessage,
        maximum: maximumErrorMessage
      }
    }

    assert(parsedSchema, jsonSchema)
  })

  test('multiple choices of strategy should result in anyOf', () => {
    const zodDateSchema = z.date()
    const parsedSchema = parseDateDef(
      zodDateSchema._def,
      getRefs({ dateStrategy: ['format:date-time', 'format:date', 'integer'] })
    )

    const jsonSchema: JSONSchema7Type = {
      anyOf: [
        {
          type: 'string',
          format: 'date-time'
        },
        {
          type: 'string',
          format: 'date'
        },
        {
          type: 'integer',
          format: 'unix-time'
        }
      ]
    }

    assert(parsedSchema, jsonSchema)
  })
})
