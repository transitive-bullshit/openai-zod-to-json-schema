import { getRefs, type Options, type Refs, type Targets } from '..'

export function errorReferences(
  options?: string | Partial<Options<Targets>>
): Refs {
  const r = getRefs(options)
  r.errorMessages = true
  return r
}
