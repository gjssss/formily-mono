import { expect } from 'vitest'
import { fn } from '../src'

it('fn', () => {
  expect(fn()).toBe('Hello, tsdown!')
})
