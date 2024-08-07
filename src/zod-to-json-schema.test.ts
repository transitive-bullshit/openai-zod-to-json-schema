import { describe, expect, test } from 'vitest'
import { z } from 'zod'

import { zodToJsonSchema } from '.'

describe('Root schema result after parsing', () => {
  test('should return the schema directly in the root if no name is passed', () => {
    expect(zodToJsonSchema(z.any())).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#'
    })
  })

  test('should return the schema inside a named property in "definitions" if a name is passed', () => {
    expect(zodToJsonSchema(z.any(), 'MySchema')).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: `#/definitions/MySchema`,
      definitions: {
        MySchema: {}
      }
    })
  })

  test('should return the schema inside a named property in "$defs" if a name and definitionPath is passed in options', () => {
    expect(
      zodToJsonSchema(z.any(), { name: 'MySchema', definitionPath: '$defs' })
    ).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: `#/$defs/MySchema`,
      $defs: {
        MySchema: {}
      }
    })
  })

  test("should not scrub 'any'-schemas from unions when strictUnions=false", () => {
    expect(
      zodToJsonSchema(
        z.union([z.any(), z.instanceof(String), z.string(), z.number()]),
        { strictUnions: false }
      )
    ).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      anyOf: [{}, {}, { type: 'string' }, { type: 'number' }]
    })
  })

  test("should scrub 'any'-schemas from unions when strictUnions=true", () => {
    expect(
      zodToJsonSchema(
        z.union([z.any(), z.instanceof(String), z.string(), z.number()]),
        { strictUnions: true }
      )
    ).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      anyOf: [{ type: 'string' }, { type: 'number' }]
    })
  })

  test("should scrub 'any'-schemas from unions when strictUnions=true in objects", () => {
    expect(
      zodToJsonSchema(
        z.object({
          field: z.union([
            z.any(),
            z.instanceof(String),
            z.string(),
            z.number()
          ])
        }),
        { strictUnions: true }
      )
    ).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
      properties: {
        field: { anyOf: [{ type: 'string' }, { type: 'number' }] }
      },
      type: 'object'
    })
  })

  test('Definitions play nice with named schemas', () => {
    const MySpecialStringSchema = z.string()
    const MyArraySchema = z.array(MySpecialStringSchema)

    const result = zodToJsonSchema(MyArraySchema, {
      definitions: {
        MySpecialStringSchema,
        MyArraySchema
      }
    })

    expect(result).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/MyArraySchema',
      definitions: {
        MySpecialStringSchema: { type: 'string' },
        MyArraySchema: {
          type: 'array',
          items: {
            $ref: '#/definitions/MySpecialStringSchema'
          }
        }
      }
    })
  })

  test('should be possible to add name as title instead of as ref', () => {
    expect(
      zodToJsonSchema(z.string(), { name: 'hello', nameStrategy: 'title' })
    ).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'string',
      title: 'hello'
    })
  })
})
