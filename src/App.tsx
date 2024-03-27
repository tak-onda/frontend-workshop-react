import { FormEvent, useState } from 'react'

type Task = {
  id: string
  name: string
  done: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAll, setShowAll] = useState(true)
  const [input, setInput] = useState('')

  const views = showAll ? tasks : tasks.filter((t) => !t.done)

  function onCheck(task: Task) {
    setTasks((tasks) => {
      return tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
    })
  }

  function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInput('')
    setTasks((tasks) => {
      return [...tasks, { id: crypto.randomUUID(), name: input, done: false }]
    })
  }

  return (
    <>
      <h1>Super TODO</h1>
      {tasks.length > 0 && (
        <>
          <h2>My Tasks</h2>
          <label>
            <input
              type={'radio'}
              name="showAll"
              checked={showAll}
              onClick={() => setShowAll(true)}
            />
            Show All (including completed)
          </label>
          <label>
            <input
              type={'radio'}
              name="showAll"
              checked={!showAll}
              onClick={() => setShowAll(false)}
            />
            Show Only To Be Done
          </label>
          <hr />
          {views.map((task) => (
            <label key={task.id} style={{ display: 'block' }}>
              <input type="checkbox" checked={task.done} onChange={() => onCheck(task)} />
              {task.done ? <s>{task.name}</s> : task.name}
            </label>
          ))}
        </>
      )}
      <h2>Register Task</h2>
      <form onSubmit={addTask}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </>
  )
}

export default App
