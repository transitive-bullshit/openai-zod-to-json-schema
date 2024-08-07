import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseObjectDef } from '..'
import { assert } from '../_utils'

describe('objects', () => {
  test('should be possible to describe catchAll schema', () => {
    const schema = z
      .object({ normalProperty: z.string() })
      .catchall(z.boolean())

    const parsedSchema = parseObjectDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      properties: {
        normalProperty: { type: 'string' }
      },
      required: ['normalProperty'],
      additionalProperties: {
        type: 'boolean'
      }
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should be possible to use selective partial', () => {
    const schema = z
      .object({ foo: z.boolean(), bar: z.number() })
      .partial({ foo: true })

    const parsedSchema = parseObjectDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      properties: {
        foo: { type: 'boolean' },
        bar: { type: 'number' }
      },
      required: ['bar'],
      additionalProperties: false
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should allow additional properties unless strict when removeAdditionalStrategy is strict', () => {
    const schema = z.object({ foo: z.boolean(), bar: z.number() })

    const parsedSchema = parseObjectDef(
      schema._def,
      getRefs({ removeAdditionalStrategy: 'strict' })
    )
    const expectedSchema = {
      type: 'object',
      properties: {
        foo: { type: 'boolean' },
        bar: { type: 'number' }
      },
      required: ['foo', 'bar'],
      additionalProperties: true
    }
    assert(parsedSchema, expectedSchema)

    const strictSchema = z
      .object({ foo: z.boolean(), bar: z.number() })
      .strict()

    const parsedStrictSchema = parseObjectDef(
      strictSchema._def,
      getRefs({ removeAdditionalStrategy: 'strict' })
    )
    const expectedStrictSchema = {
      type: 'object',
      properties: {
        foo: { type: 'boolean' },
        bar: { type: 'number' }
      },
      required: ['foo', 'bar'],
      additionalProperties: false
    }
    assert(parsedStrictSchema, expectedStrictSchema)
  })
})
