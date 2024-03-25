import { atom } from 'jotai'

type Task = {
  id: string
  title: string
  completed: boolean
}

export const tasks = atom<Task[]>([])
export const showsAll = atom(true)

export const addTask = atom(null, (_, set, title: string) => {
  set(tasks, (prev) => [...prev, { id: String(prev.length + 1), title, completed: false }])
})

export const toggleCompleteTask = atom(null, (_, set, id: string) => {
  set(tasks, (prev) =>
    prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
  )
})

export const filteredTasks = atom((get) => {
  const allTasks = get(tasks)
  const isShowAll = get(showsAll)
  return filter(allTasks, isShowAll)
})

export const hasTasks = atom((get) => get(tasks).length > 0)

// atom 定義から pure function として分離して単体テストをやりやすく
function filter(allTasks: Task[], isShowAll: boolean) {
  return isShowAll ? allTasks : allTasks.filter((task) => !task.completed)
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('filter', () => {
    const tasks: Task[] = [
      { id: 'a', title: 'task1', completed: true },
      { id: 'b', title: 'task2', completed: false },
      { id: 'c', title: 'task3', completed: false },
    ]
    it('showAll', () => {
      expect(filter(tasks, true).length).toBe(3)
      expect(filter(tasks, true)).toEqual(tasks)
    })
    it('TBD only', () => {
      expect(filter(tasks, false).length).toBe(2)
      expect(filter(tasks, false)).toEqual([
        { id: 'b', title: 'task2', completed: false },
        { id: 'c', title: 'task3', completed: false },
      ])
    })
  })
}
