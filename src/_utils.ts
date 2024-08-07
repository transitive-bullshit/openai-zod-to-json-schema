import { expect } from 'vitest'

export function assert<T, E>(inputA: T, inputB: E) {
  expect(inputA).toEqual(inputB)
}
