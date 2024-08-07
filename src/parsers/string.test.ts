import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import {
  type ErrorMessages,
  getRefs,
  type JsonSchema7StringType,
  parseStringDef,
  zodPatterns
} from '..'
import { assert } from '../_utils'
import { errorReferences } from './error-references.js'

const ajv = addFormats(new Ajv())

describe('String validations', () => {
  test('should be possible to describe minimum length of a string', () => {
    const parsedSchema = parseStringDef(z.string().min(5)._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      minLength: 5
    }
    assert(parsedSchema, jsonSchema)

    ajv.validate(parsedSchema, '1234')
    assert(ajv.errors, [
      {
        keyword: 'minLength',
        instancePath: '',
        schemaPath: '#/minLength',
        params: { limit: 5 },
        message: 'must NOT have fewer than 5 characters'
      }
    ])
  })
  test('should be possible to describe maximum length of a string', () => {
    const parsedSchema = parseStringDef(z.string().max(5)._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      maxLength: 5
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, '123456')
    assert(ajv.errors, [
      {
        keyword: 'maxLength',
        instancePath: '',
        schemaPath: '#/maxLength',
        params: { limit: 5 },
        message: 'must NOT have more than 5 characters'
      }
    ])
  })
  test('should be possible to describe both minimum and maximum length of a string', () => {
    const parsedSchema = parseStringDef(
      z.string().min(5).max(5)._def,
      getRefs()
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      minLength: 5,
      maxLength: 5
    }
    assert(parsedSchema, jsonSchema)
  })
  test('should be possible to use email constraint', () => {
    const parsedSchema = parseStringDef(z.string().email()._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      format: 'email'
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, 'herpderp')
    assert(ajv.errors, [
      {
        instancePath: '',
        schemaPath: '#/format',
        keyword: 'format',
        params: { format: 'email' },
        message: 'must match format "email"'
      }
    ])
    assert(ajv.validate(parsedSchema, 'hej@hej.com'), true)
  })
  test('should be possible to use uuid constraint', () => {
    const parsedSchema = parseStringDef(z.string().uuid()._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      format: 'uuid'
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, 'herpderp')
    assert(ajv.errors, [
      {
        instancePath: '',
        schemaPath: '#/format',
        keyword: 'format',
        params: { format: 'uuid' },
        message: 'must match format "uuid"'
      }
    ])
    assert(
      ajv.validate(parsedSchema, '2ad7b2ce-e571-44b8-bee3-84fb3ac80d6b'),
      true
    )
  })
  test('should be possible to use url constraint', () => {
    const parsedSchema = parseStringDef(z.string().url()._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      format: 'uri'
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, 'herpderp')
    assert(ajv.errors, [
      {
        instancePath: '',
        schemaPath: '#/format',
        keyword: 'format',
        params: { format: 'uri' },
        message: 'must match format "uri"'
      }
    ])
    assert(ajv.validate(parsedSchema, 'http://hello.com'), true)
  })

  test('should be possible to use regex constraint', () => {
    const parsedSchema = parseStringDef(
      z.string().regex(/[A-C]/)._def,
      getRefs()
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      pattern: '[A-C]'
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, 'herpderp')
    assert(ajv.errors, [
      {
        instancePath: '',
        schemaPath: '#/pattern',
        keyword: 'pattern',
        params: { pattern: '[A-C]' },
        message: 'must match pattern "[A-C]"'
      }
    ])
    assert(ajv.validate(parsedSchema, 'B'), true)
  })

  test('should be possible to use CUID constraint', () => {
    const parsedSchema = parseStringDef(z.string().cuid()._def, getRefs())
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      pattern: '^[cC][^\\s-]{8,}$'
    }
    assert(parsedSchema, jsonSchema)
    ajv.validate(parsedSchema, 'herpderp')
    assert(ajv.errors, [
      {
        instancePath: '',
        schemaPath: '#/pattern',
        keyword: 'pattern',
        params: { pattern: '^[cC][^\\s-]{8,}$' },
        message: 'must match pattern "^[cC][^\\s-]{8,}$"'
      }
    ])
    assert(ajv.validate(parsedSchema, 'ckopqwooh000001la8mbi2im9'), true)
  })

  test('should gracefully ignore the .trim() "check"', () => {
    const parsedSchema = parseStringDef(z.string().trim()._def, getRefs())
    const jsonSchema = { type: 'string' }
    assert(parsedSchema, jsonSchema)
  })

  test('should work with the startsWith check', () => {
    assert(
      parseStringDef(z.string().startsWith('aBcD123{}[]')._def, getRefs()),
      {
        type: 'string',
        pattern: '^aBcD123\\{\\}\\[\\]'
      }
    )
  })

  test('should work with the endsWith check', () => {
    assert(parseStringDef(z.string().endsWith('aBcD123{}[]')._def, getRefs()), {
      type: 'string',
      pattern: 'aBcD123\\{\\}\\[\\]$'
    })
  })

  test('should bundle multiple pattern type checks in an allOf container', () => {
    assert(
      parseStringDef(
        z.string().startsWith('alpha').endsWith('omega')._def,
        getRefs()
      ),
      {
        type: 'string',
        allOf: [
          {
            pattern: '^alpha'
          },
          {
            pattern: 'omega$'
          }
        ]
      }
    )
  })

  test('should pick correct value if multiple min/max are present', () => {
    assert(
      parseStringDef(z.string().min(1).min(2).max(3).max(4)._def, getRefs()),
      {
        type: 'string',
        maxLength: 3,
        minLength: 2
      }
    )
  })

  test("should include custom error messages for each string check if they're included", () => {
    const regex = /cool/
    const errorMessages = {
      min: 'Not long enough',
      max: 'Too long',
      emailStrategy: 'not email',
      url: 'not url',
      uuid: 'not uuid',
      regex: "didn't match regex " + regex.source,
      startsWith: "didn't start with " + regex.source,
      endsWith: "didn't end with " + regex.source
    }
    const testCases: {
      schema: z.ZodString
      errorMessage: ErrorMessages<JsonSchema7StringType>
    }[] = [
      {
        schema: z.string().min(1, errorMessages.min),
        errorMessage: {
          minLength: errorMessages.min
        }
      },
      {
        schema: z.string().max(1, errorMessages.max),
        errorMessage: {
          maxLength: errorMessages.max
        }
      },
      {
        schema: z.string().uuid(errorMessages.uuid),
        errorMessage: {
          format: errorMessages.uuid
        }
      },
      {
        schema: z.string().email(errorMessages.emailStrategy),
        errorMessage: {
          format: errorMessages.emailStrategy
        }
      },
      {
        schema: z.string().url(errorMessages.url),
        errorMessage: {
          format: errorMessages.url
        }
      },
      {
        schema: z.string().startsWith(regex.source, errorMessages.startsWith),
        errorMessage: {
          pattern: errorMessages.startsWith
        }
      },
      {
        schema: z.string().endsWith(regex.source, errorMessages.endsWith),
        errorMessage: {
          pattern: errorMessages.endsWith
        }
      },
      {
        schema: z.string().regex(regex, errorMessages.regex),
        errorMessage: {
          pattern: errorMessages.regex
        }
      }
    ]
    for (const testCase of testCases) {
      const { schema, errorMessage } = testCase
      const jsonSchema: JSONSchema7Type = {
        type: 'string',
        errorMessage
      }
      const jsonSchemaParsed = parseStringDef(schema._def, errorReferences())
      assert(jsonSchemaParsed.errorMessage, jsonSchema.errorMessage)
    }
  })
  test("should not include a custom error message for any string when they aren't passed for single checks", () => {
    const regex = /cool/
    const testCases: z.ZodString[] = [
      z.string().min(1),
      z.string().max(1),
      z.string().uuid(),
      z.string().email(),
      z.string().url(),
      z.string().startsWith(regex.source),
      z.string().endsWith(regex.source),
      z.string().regex(regex),
      z.string().regex(regex).regex(regex)
    ]
    for (const schema of testCases) {
      const jsonSchemaParsed = parseStringDef(schema._def, errorReferences())
      assert(jsonSchemaParsed.errorMessage, undefined)
    }
  })
  test("should include custom error messages in 'allOf' if they're passed for a given pattern, and include other errors at the top level.", () => {
    const regex = /cool/
    const pattern = regex.source
    const errorMessages = {
      one: `Pattern one doesn't match.`,
      two: `Pattern two doesn't match`,
      format: 'Pretty terrible format',
      minLength: 'too short',
      maxLength: 'too long'
    }
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      minLength: 5,
      maxLength: 10,
      format: 'uuid',
      allOf: [
        {
          pattern,
          errorMessage: {
            pattern: errorMessages.one
          }
        },
        {
          pattern,
          errorMessage: {
            pattern: errorMessages.two
          }
        },
        {
          pattern
        }
      ],
      errorMessage: {
        format: errorMessages.format,
        minLength: errorMessages.minLength
      }
    }
    const zodSchema = z
      .string()
      .max(10)
      .uuid(errorMessages.format)
      .min(5, errorMessages.minLength)
      .regex(regex, errorMessages.one)
      .regex(regex, errorMessages.two)
      .regex(regex)
    const jsonSchemaParse = parseStringDef(zodSchema._def, errorReferences())
    assert(jsonSchemaParse, jsonSchema)
  })

  test('should include include the pattern error message in the top level with other messages if there is only one pattern', () => {
    const formatMessage = 'not a uuid'
    const regex = /cool/
    const regexErrorMessage = "doesn't match regex " + regex.source
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      format: 'uuid',
      pattern: regex.source,
      errorMessage: {
        format: formatMessage,
        pattern: regexErrorMessage
      }
    }
    const zodSchema = z
      .string()
      .uuid(formatMessage)
      .regex(regex, regexErrorMessage)
    const jsonParsedSchema = parseStringDef(zodSchema._def, errorReferences())
    assert(jsonParsedSchema, jsonSchema)
  })

  test("should not include error messages if the error message option isn't explicitly passed to References constructor", () => {
    const zodSchema = [
      z.string().min(5, 'bad'),
      z.string().max(5, 'bad'),
      z.string().regex(/cool/, 'bad'),
      z.string().uuid('bad'),
      z.string().email('bad'),
      z.string().url('bad'),
      z.string().regex(/cool/, 'bad').regex(/cool/, 'bad').url('bad')
    ]
    for (const schema of zodSchema) {
      const jsonParsedSchema = parseStringDef(schema._def, getRefs())
      assert(jsonParsedSchema.errorMessage, undefined)
      if (!jsonParsedSchema.allOf?.length) continue
      for (const oneOf of jsonParsedSchema.allOf) {
        assert(oneOf.errorMessage, undefined)
      }
    }
  })

  test('should bundle multiple formats into anyOf', () => {
    const zodSchema = z.string().ip().email()
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      anyOf: [
        {
          format: 'ipv4'
        },
        {
          format: 'ipv6'
        },
        {
          format: 'email'
        }
      ]
    }
    const jsonParsedSchema = parseStringDef(zodSchema._def, errorReferences())
    assert(jsonParsedSchema, jsonSchema)
  })

  test('should default to contentEncoding for base64, but format and pattern should also work', () => {
    const def = z.string().base64()._def

    assert(parseStringDef(def, getRefs()), {
      type: 'string',
      contentEncoding: 'base64'
    })

    assert(
      parseStringDef(
        def,
        getRefs({ base64Strategy: 'contentEncoding:base64' })
      ),
      {
        type: 'string',
        contentEncoding: 'base64'
      }
    )

    assert(parseStringDef(def, getRefs({ base64Strategy: 'format:binary' })), {
      type: 'string',
      format: 'binary'
    })

    assert(parseStringDef(def, getRefs({ base64Strategy: 'pattern:zod' })), {
      type: 'string',
      pattern: zodPatterns.base64.source
    })
  })

  test('should be possible to pick format:email, format:idn-email or pattern:zod', () => {
    assert(parseStringDef(z.string().email()._def, getRefs()), {
      type: 'string',
      format: 'email'
    })

    assert(
      parseStringDef(
        z.string().email()._def,
        getRefs({ emailStrategy: 'format:email' })
      ),
      {
        type: 'string',
        format: 'email'
      }
    )

    assert(
      parseStringDef(
        z.string().email()._def,
        getRefs({ emailStrategy: 'format:idn-email' })
      ),
      {
        type: 'string',
        format: 'idn-email'
      }
    )

    assert(
      parseStringDef(
        z.string().email()._def,
        getRefs({ emailStrategy: 'pattern:zod' })
      ),
      {
        type: 'string',
        pattern: zodPatterns.email.source
      }
    )
  })

  test('should correctly handle reasonable non-contrived regexes with flags', () => {
    assert(
      parseStringDef(
        z.string().regex(/(^|\^foo)Ba[r-z]+./)._def,
        getRefs({ applyRegexFlags: true })
      ),
      {
        type: 'string',
        pattern: '(^|\\^foo)Ba[r-z]+.'
      }
    )

    assert(
      parseStringDef(
        z.string().regex(/(^|\^foo)ba[r-z]+./i)._def,
        getRefs({ applyRegexFlags: true })
      ),
      {
        type: 'string',
        pattern: '(^|\\^[fF][oO][oO])[bB][aA][r-zR-Z]+.'
      }
    )

    assert(
      parseStringDef(
        z.string().regex(/(^|\^foo)Ba[r-z]+./ms)._def,
        getRefs({ applyRegexFlags: true })
      ),
      {
        type: 'string',
        pattern: '((^|(?<=[\r\n]))|\\^foo)Ba[r-z]+[.\r\n]'
      }
    )

    assert(
      parseStringDef(
        z.string().regex(/(^|\^foo)ba[r-z]+./ims)._def,
        getRefs({ applyRegexFlags: true })
      ),
      {
        type: 'string',
        pattern: '((^|(?<=[\r\n]))|\\^[fF][oO][oO])[bB][aA][r-zR-Z]+[.\r\n]'
      }
    )
  })
})
