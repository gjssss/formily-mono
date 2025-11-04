import { expect, it } from 'vitest'
import { getByPath, setByPath } from './object'
import { SchemaStateMap } from './shared'

it('getByPath', () => {
  expect(getByPath({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1)

  expect(getByPath({ a: [1, 2, 3] }, 'a.1')).toBe(2)
  expect(getByPath({ a: [1, { b: 2 }], c: 3 }, 'a.1.b')).toBe(2)
  expect(getByPath({ a: { b: { c: 1 } } }, 'a.b.d')).toBeUndefined()

  expect(getByPath({
    componentProps: {
      maxlength: 1,
    },
  }, 'x-component-props.maxlength', { transformKey: (key) => {
    if (key in SchemaStateMap)
      return SchemaStateMap[key as keyof typeof SchemaStateMap]
    return key
  } })).toBe(1)
})

it('setByPath', () => {
  const obj1 = { a: { b: { c: 1 } } }
  setByPath(obj1, 'a.b.c', 2)
  expect(obj1).toEqual({ a: { b: { c: 2 } } })

  const obj2 = { a: [1, 2, 3] }
  setByPath(obj2, 'a.1', 4)
  expect(obj2).toEqual({ a: [1, 4, 3] })

  const obj3 = { a: { b: { c: 1 } } }
  setByPath(obj3, 'a.b.d', 2)
  expect(obj3).toEqual({ a: { b: { c: 1, d: 2 } } })

  const obj4 = { a: [1, { b: 2 }], c: 3 }
  setByPath(obj4, 'a.1.b', 4)
  expect(obj4).toEqual({ a: [1, { b: 4 }], c: 3 })
})
