import { describe, it, expect } from 'vitest'
import { createStore } from 'jotai'
import { addTask, toggleCompleteTask, filteredTasks, showsAll, tasks } from './state.ts'

describe('integration test', () => {
  it('create tasks, complete task', () => {
    const store = createStore()
    store.set(showsAll, true)

    store.set(addTask, 'task1')
    store.set(addTask, 'task2')
    store.set(addTask, 'task3')
    expect(store.get(filteredTasks).length).toBe(3)

    store.set(toggleCompleteTask, '1')
    expect(store.get(tasks).find((t) => t.id === '1')?.completed).toBe(true)

    store.set(showsAll, false)
    expect(store.get(filteredTasks).length).toBe(2)

    store.set(toggleCompleteTask, '1')
    expect(store.get(filteredTasks).length).toBe(3)
  })
})
