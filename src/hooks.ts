import { useAtomValue, useSetAtom } from 'jotai'
import { addTask, filteredTasks, hasTasks, showsAll, toggleCompleteTask } from './state.ts'
import { useCallback } from 'react'

export function useFilteredTasks() {
  return useAtomValue(filteredTasks)
}

export function useHasTasks() {
  return useAtomValue(hasTasks)
}

export function useShowAll() {
  const shows = useAtomValue(showsAll)
  const set = useSetAtom(showsAll)
  const showAll = useCallback(() => set(true), [set])
  const showTbdOnly = useCallback(() => set(false), [set])
  return { shows, showAll, showTbdOnly }
}

export function useToggleCompleteTask() {
  const set = useSetAtom(toggleCompleteTask)
  return useCallback((id: string) => set(id), [set])
}

export function useAddTask() {
  const set = useSetAtom(addTask)
  return useCallback((title: string) => set(title), [set])
}
