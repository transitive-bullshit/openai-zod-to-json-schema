import { type JSONSchema7Type } from 'json-schema'
import { describe, test } from 'vitest'
import { z } from 'zod'

import { parseNativeEnumDef } from '..'
import { assert } from '../_utils'

describe('Native enums', () => {
  test('should be possible to convert a basic native number enum', () => {
    enum MyEnum {
      val1,
      val2,
      val3
    }

    const parsedSchema = parseNativeEnumDef(z.nativeEnum(MyEnum)._def)
    const jsonSchema: JSONSchema7Type = {
      type: 'number',
      enum: [0, 1, 2]
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to convert a native string enum', () => {
    enum MyEnum {
      val1 = 'a',
      val2 = 'b',
      val3 = 'c'
    }

    const parsedSchema = parseNativeEnumDef(z.nativeEnum(MyEnum)._def)
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      enum: ['a', 'b', 'c']
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to convert a mixed value native enum', () => {
    enum MyEnum {
      val1 = 'a',
      val2 = 1,
      val3 = 'c'
    }

    const parsedSchema = parseNativeEnumDef(z.nativeEnum(MyEnum)._def)
    const jsonSchema: JSONSchema7Type = {
      type: ['string', 'number'],
      enum: ['a', 1, 'c']
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to convert a native const assertion object', () => {
    const MyConstAssertionObject = {
      val1: 0,
      val2: 1,
      val3: 2
    } as const

    const parsedSchema = parseNativeEnumDef(
      z.nativeEnum(MyConstAssertionObject)._def
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'number',
      enum: [0, 1, 2]
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to convert a native const assertion string object', () => {
    const MyConstAssertionObject = {
      val1: 'a',
      val2: 'b',
      val3: 'c'
    } as const

    const parsedSchema = parseNativeEnumDef(
      z.nativeEnum(MyConstAssertionObject)._def
    )
    const jsonSchema: JSONSchema7Type = {
      type: 'string',
      enum: ['a', 'b', 'c']
    }
    assert(parsedSchema, jsonSchema)
  })

  test('should be possible to convert a mixed value native const assertion string object', () => {
    const MyConstAssertionObject = {
      val1: 'a',
      val2: 1,
      val3: 'c'
    } as const

    const parsedSchema = parseNativeEnumDef(
      z.nativeEnum(MyConstAssertionObject)._def
    )
    const jsonSchema: JSONSchema7Type = {
      type: ['string', 'number'],
      enum: ['a', 1, 'c']
    }
    assert(parsedSchema, jsonSchema)
  })
})
