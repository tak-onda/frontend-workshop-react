import { atom, createStore } from 'jotai'

const a = atom(0)
const b = atom('hello')

const aPlus1 = atom((get) => get(a) + 1)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('primitive atom', () => {
    it('has initial value', () => {
      const store = createStore()
      expect(store.get(a)).toBe(0)
      expect(store.get(b)).toBe('hello')
    })

    it('value change: a', () => {
      const store = createStore()
      expect(store.get(a)).toBe(0)
      store.set(a, 1)
      expect(store.get(a)).toBe(1)
    })

    it('value change: b', () => {
      const store = createStore()
      expect(store.get(b)).toBe('hello')
      store.set(b, (current) => current + ' world')
      expect(store.get(b)).toBe('hello world')
    })
  })

  describe('jotai store', () => {
    it('dependant', () => {
      const store1 = createStore()
      const store2 = createStore()
      expect(store1.get(a)).toBe(0)
      store1.set(a, 1)
      expect(store1.get(a)).toBe(1)
      expect(store2.get(a)).toBe(0)
    })
  })

  describe('derived atom', () => {
    it('dependant', () => {
      const store = createStore()
      expect(store.get(a)).toBe(0)
      expect(store.get(aPlus1)).toBe(1)
      store.set(a, 10)
      expect(store.get(a)).toBe(10)
      expect(store.get(aPlus1)).toBe(11)
    })
  })
}
