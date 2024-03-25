import { FormEvent, useState } from 'react'
import {
  useAddTask,
  useFilteredTasks,
  useHasTasks,
  useShowAll,
  useToggleCompleteTask,
} from './hooks.ts'

export function App() {
  const hasTasks = useHasTasks()
  return (
    <>
      <h1>Super TODO</h1>
      {hasTasks && (
        <>
          <h2>My Tasks</h2>
          <Filter />
          <hr />
          <TaskList />
        </>
      )}
      <h2>Register Task</h2>
      <Register />
    </>
  )
}

function Filter() {
  const { shows, showAll, showTbdOnly } = useShowAll()
  return (
    <>
      <label>
        <input type={'radio'} name="showAll" checked={shows} onClick={showAll} />
        Show All (including completed)
      </label>
      <label>
        <input type={'radio'} name="showAll" checked={!shows} onClick={showTbdOnly} />
        Show Only To Be Done
      </label>
    </>
  )
}

function TaskList() {
  const views = useFilteredTasks()
  const toggle = useToggleCompleteTask()
  return (
    <>
      {views.map((task) => (
        <div key={task.id}>
          <input type="checkbox" checked={task.completed} onChange={() => toggle(task.id)} />
          {task.completed ? <s>{task.title}</s> : task.title}
        </div>
      ))}
    </>
  )
}

function Register() {
  const [input, setInput] = useState('')
  const addTask = useAddTask()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setInput('')
    addTask(input)
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}
