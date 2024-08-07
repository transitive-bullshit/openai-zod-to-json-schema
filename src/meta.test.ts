import type { JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { zodToJsonSchema } from '.'
import { assert } from './_utils'

describe('Metadata', () => {
  test('should be possible to use description', () => {
    const $z = z.string().describe('My neat string')
    const $j = zodToJsonSchema($z)
    const $e: JSONSchema7Type = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'string',
      description: 'My neat string'
    }

    assert($j, $e)
  })

  test('should be possible to add a markdownDescription', () => {
    const $z = z.string().describe('My neat string')
    const $j = zodToJsonSchema($z, { markdownDescription: true })
    const $e = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'string',
      description: 'My neat string',
      markdownDescription: 'My neat string'
    }

    assert($j, $e)
  })

  test('should handle optional schemas with different descriptions', () => {
    const recurringSchema = z.object({})
    const zodSchema = z
      .object({
        p1: recurringSchema.optional().describe('aaaaaaaaa'),
        p2: recurringSchema.optional().describe('bbbbbbbbb'),
        p3: recurringSchema.optional().describe('ccccccccc')
      })
      .describe('sssssssss')

    const jsonSchema = zodToJsonSchema(zodSchema, {
      target: 'openApi3',
      $refStrategy: 'none'
    })

    assert(jsonSchema, {
      additionalProperties: false,
      description: 'sssssssss',
      properties: {
        p1: {
          additionalProperties: false,
          description: 'aaaaaaaaa',
          properties: {},
          type: 'object'
        },
        p2: {
          additionalProperties: false,
          description: 'bbbbbbbbb',
          properties: {},
          type: 'object'
        },
        p3: {
          additionalProperties: false,
          description: 'ccccccccc',
          properties: {},
          type: 'object'
        }
      },
      type: 'object'
    })
  })
})
