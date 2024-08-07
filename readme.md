# openai-zod-to-json-schema <!-- omit from toc -->

> Convert [Zod schemas](https://zod.dev) to [JSON schemas](https://json-schema.org) which are optionally compatible with [OpenAI's structured outputs](https://platform.openai.com/docs/guides/structured-outputs).

<p>
  <a href="https://github.com/transitive-bullshit/openai-zod-to-json-schema/actions/workflows/main.yml"><img alt="Build Status" src="https://github.com/transitive-bullshit/openai-zod-to-json-schema/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/openai-zod-to-json-schema"><img alt="NPM" src="https://img.shields.io/npm/v/openai-zod-to-json-schema.svg" /></a>
  <a href="https://github.com/transitive-bullshit/openai-zod-to-json-schema/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

- [Intro](#intro)
- [Install](#install)
- [Usage](#usage)
- [Why?](#why)
- [License](#license)

## Intro

This package exports OpenAI's [vendored version of zod-to-json-schema](https://github.com/openai/openai-node/tree/master/src/_vendor/zod-to-json-schema) as a standalone module (the source code is copied directly to guarantee a 1:1 match).

It re-adds all of the unit tests from the original [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema) by [Stefan Terdell](https://github.com/StefanTerdell).

It also adds some additional unit tests for OpenAI's `strict` mode. See [OpenAI's docs on structured outputs](https://platform.openai.com/docs/guides/structured-outputs/supported-schemas) for more details on the subset of JSON Schemas that are supported by OpenAI's structured outputs.

This package will be kept in sync with any changes to OpenAI's vendored version.

## Install

> [!NOTE]
> This package requires `Node.js >= 18` or an equivalent environment (Bun, Deno, CF workers, etc).

```sh
npm install openai-zod-to-json-schema zod
```

## Usage

All usage is the same as the original [zod-to-json-schema](https://github.com/StefanTerdell/zod-to-json-schema), with the addition of a single optional boolean option: `openaiStrictMode`.

```ts
import { zodToJsonSchema } from 'openai-zod-to-json-schema'
import { z } from 'zod'

const schema = zodToJsonSchema(z.any(), { openaiStrictMode: true })
```

## Why?

- We should be able to access OpenAI's version of `zod-to-json-schema` without depending on the entire `openai` package.
- OpenAI's vendored version of `zod-to-json-schema` removed all unit tests for some reason, which could cause undesired regressions.
- We wanted a minimal, OpenAI-compatible version of `zod-to-json-schema` for [openai-fetch](https://github.com/dexaai/openai-fetch), [dexter](https://github.com/dexaai/dexter), and [agentic](https://github.com/transitive-bullshit/agentic).

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)

Also see the original [zod-to-json-schema license](https://github.com/StefanTerdell/zod-to-json-schema).
