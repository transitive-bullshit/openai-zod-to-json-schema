import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseDefaultDef } from '..'
import { assert } from '../_utils'

describe('promise', () => {
  test('should be possible to use default on objects', () => {
    const parsedSchema = parseDefaultDef(
      z.object({ foo: z.boolean() }).default({ foo: true })._def,
      getRefs()
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'object',
      additionalProperties: false,
      required: ['foo'],
      properties: {
        foo: {
          type: 'boolean'
        }
      },
      default: {
        foo: true
      }
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to use default on primitives', () => {
    const parsedSchema = parseDefaultDef(
      z.string().default('default')._def,
      getRefs()
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      default: 'default'
    }
    assert(parsedSchema, jsonSchema)
  })

  test('default with transform', () => {
    const stringWithDefault = z
      .string()
      .transform((val) => val.toUpperCase())
      .default('default')

    const parsedSchema = parseDefaultDef(stringWithDefault._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      default: 'default'
    }

    assert(parsedSchema, jsonSchema)
  })
})
