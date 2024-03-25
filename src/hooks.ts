import { useAtomValue, useSetAtom } from 'jotai'
import { addTask, filteredTasks, hasTasks, showsAll, toggleCompleteTask } from './state.ts'

export function useFilteredTasks() {
  return useAtomValue(filteredTasks)
}

export function useHasTasks() {
  return useAtomValue(hasTasks)
}

export function useShowAll() {
  const shows = useAtomValue(showsAll)
  const set = useSetAtom(showsAll)
  const showAll = () => set(true)
  const showTbdOnly = () => set(false)
  return { shows, showAll, showTbdOnly }
}

export function useToggleCompleteTask() {
  return useSetAtom(toggleCompleteTask)
}

export function useAddTask() {
  return useSetAtom(addTask)
}
