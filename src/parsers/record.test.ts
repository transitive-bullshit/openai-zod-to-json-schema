import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseRecordDef } from '..'
import { assert } from '../_utils'

describe('records', () => {
  test('should be possible to describe a simple record', () => {
    const schema = z.record(z.number())

    const parsedSchema = parseRecordDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should be possible to describe a complex record with checks', () => {
    const schema = z.record(
      z.object({ foo: z.number().min(2) }).catchall(z.string().cuid())
    )

    const parsedSchema = parseRecordDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            minimum: 2
          }
        },
        required: ['foo'],
        additionalProperties: {
          type: 'string',
          pattern: '^[cC][^\\s-]{8,}$'
        }
      }
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should be possible to describe a key schema', () => {
    const schema = z.record(z.string().uuid(), z.number())

    const parsedSchema = parseRecordDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      additionalProperties: {
        type: 'number'
      },
      propertyNames: {
        format: 'uuid'
      }
    }
    assert(parsedSchema, expectedSchema)
  })

  test('should be possible to describe a key with an enum', () => {
    const schema = z.record(z.enum(['foo', 'bar']), z.number())
    const parsedSchema = parseRecordDef(schema._def, getRefs())
    const expectedSchema = {
      type: 'object',
      additionalProperties: {
        type: 'number'
      },
      propertyNames: {
        enum: ['foo', 'bar']
      }
    }
    assert(parsedSchema, expectedSchema)
  })
})
