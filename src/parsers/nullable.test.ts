import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parseObjectDef } from '..'
import { assert } from '../_utils'

describe('nullable', () => {
  test('should be possible to properly reference nested nullable primitives', () => {
    const nullablePrimitive = z.string().nullable()

    const schema = z.object({
      one: nullablePrimitive,
      two: nullablePrimitive
    })

    const jsonSchema: any = parseObjectDef(schema._def, getRefs())

    assert(jsonSchema.properties.one.type, ['string', 'null'])
    assert(jsonSchema.properties.two.$ref, '#/properties/one')
  })

  test('should be possible to properly reference nested nullable primitives', () => {
    const three = z.string()

    const nullableObject = z
      .object({
        three
      })
      .nullable()

    const schema = z.object({
      one: nullableObject,
      two: nullableObject,
      three
    })

    const jsonSchema: any = parseObjectDef(schema._def, getRefs())

    assert(jsonSchema.properties.one, {
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['three'],
          properties: {
            three: {
              type: 'string'
            }
          }
        },
        {
          type: 'null'
        }
      ]
    })
    assert(jsonSchema.properties.two.$ref, '#/properties/one')
    assert(
      jsonSchema.properties.three.$ref,
      '#/properties/one/anyOf/0/properties/three'
    )
  })
})
