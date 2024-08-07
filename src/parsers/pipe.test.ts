import { describe, test } from 'vitest'
import { z } from 'zod'

import { getRefs, parsePipelineDef } from '..'
import { assert } from '../_utils'

describe('pipe', () => {
  test('Should create an allOf schema with all its inner schemas represented', () => {
    const schema = z.number().pipe(z.number().int())

    assert(parsePipelineDef(schema._def, getRefs()), {
      allOf: [{ type: 'number' }, { type: 'integer' }]
    })
  })

  test('Should parse the input schema if that strategy is selected', () => {
    const schema = z.number().pipe(z.number().int())

    assert(parsePipelineDef(schema._def, getRefs({ pipeStrategy: 'input' })), {
      type: 'number'
    })
  })

  test('Should parse the output schema (last schema in pipe) if that strategy is selected', () => {
    const schema = z.string().pipe(z.date()).pipe(z.number().int())

    assert(parsePipelineDef(schema._def, getRefs({ pipeStrategy: 'output' })), {
      type: 'integer'
    })
  })
})
