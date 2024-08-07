import { describe, expect, test } from 'vitest'
import { z } from 'zod'

import { zodToJsonSchema } from '.'

describe('The readme example', () => {
  test('should be valid', () => {
    const mySchema = z
      .object({
        myString: z.string().min(5),
        myUnion: z.union([z.number(), z.boolean()])
      })
      .describe('My neat object schema')

    const jsonSchema = zodToJsonSchema(mySchema, 'mySchema')

    expect(jsonSchema).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/definitions/mySchema',
      definitions: {
        mySchema: {
          description: 'My neat object schema',
          type: 'object',
          properties: {
            myString: {
              type: 'string',
              minLength: 5
            },
            myUnion: {
              type: ['number', 'boolean']
            }
          },
          additionalProperties: false,
          required: ['myString', 'myUnion']
        }
      }
    })
  })

  test('should have a valid error message example', () => {
    const EmailSchema = z.string().email('Invalid email').min(5, 'Too short')
    const expected = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'string',
      format: 'email',
      minLength: 5,
      errorMessage: {
        format: 'Invalid email',
        minLength: 'Too short'
      }
    }
    const parsedJsonSchema = zodToJsonSchema(EmailSchema, {
      errorMessages: true
    })
    expect(parsedJsonSchema).toEqual(expected)
  })
})
