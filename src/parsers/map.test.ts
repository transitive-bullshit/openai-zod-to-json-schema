import Ajv from 'ajv'
import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseMapDef } from '..'
import { assert } from '../_utils'

const ajv = new Ajv()
describe('map', () => {
  test('should be possible to use Map', () => {
    const mapSchema = z.map(z.string(), z.number())

    const parsedSchema = parseMapDef(mapSchema._def, getRefs())

    const jsonSchema: JSONSchema7Type = {
      type: 'array',
      maxItems: 125,
      items: {
        type: 'array',
        items: [
          {
            type: 'string'
          },
          {
            type: 'number'
          }
        ],
        minItems: 2,
        maxItems: 2
      }
    }

    assert(parsedSchema, jsonSchema)

    const myMap: z.infer<typeof mapSchema> = new Map<string, number>()
    myMap.set('hello', 123)

    ajv.validate(jsonSchema, [...myMap])
    const ajvResult = !ajv.errors

    const zodResult = mapSchema.safeParse(myMap).success

    assert(zodResult, true)
    assert(ajvResult, true)
  })

  test('should be possible to use additionalProperties-pattern (record)', () => {
    assert(
      parseMapDef(
        z.map(z.string().min(1), z.number())._def,
        getRefs({ mapStrategy: 'record' })
      ),
      {
        type: 'object',
        additionalProperties: {
          type: 'number'
        },
        propertyNames: {
          minLength: 1
        }
      }
    )
  })
})
