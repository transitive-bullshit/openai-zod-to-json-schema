import { describe, expect, test } from 'vitest'
import { z } from 'zod'

import { zodToJsonSchema } from '.'

describe('openaiStrictMode', () => {
  test('Optional properties should be set as required', () => {
    expect(
      zodToJsonSchema(
        z.object({
          foo: z.string(),
          bar: z.number().optional(),
          baz: z
            .object({
              nala: z.string().optional()
            })
            .optional()
        }),
        { openaiStrictMode: true }
      )
    ).toMatchSnapshot()
  })
})
