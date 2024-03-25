function add(a: number, b: number): number {
  return a + b
}
const addOne = add.bind(null, 1)

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('add', () => {
    it('adds two numbers', () => {
      expect(add(1, 2)).toBe(3)
    })
  })
  describe('addOne', () => {
    it('adds one to a number', () => {
      expect(addOne(2)).toBe(3)
    })
  })
}
