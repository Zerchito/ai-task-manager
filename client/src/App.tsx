import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000'

interface Task {
  _id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  subtasks: string[]
  createdAt: string
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/tasks`)
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!title.trim()) return
    setCreating(true)
    try {
      await axios.post(`${API}/tasks`, { title, description })
      setTitle('')
      setDescription('')
      await fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setCreating(false)
    }
  }

  const completeTask = async (id: string) => {
    try {
      await axios.patch(`${API}/tasks/${id}/complete`)
      await fetchTasks()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API}/tasks/${id}`)
      await fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">AI Task Manager</h1>
          <p className="text-gray-500 mt-1">
            Describe your task and AI will prioritize and break it down for you
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional — the more detail, the better the AI suggestions)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={createTask}
            disabled={creating || !title.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 rounded-lg text-sm transition-colors"
          >
            {creating ? 'Analyzing with AI...' : 'Create Task'}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No tasks yet. Create your first one!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tasks.map(task => (
              <div
                key={task._id}
                className={`bg-white rounded-2xl border p-5 transition-opacity ${task.completed ? 'opacity-50' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h2 className={`font-semibold text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h2>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                {task.subtasks.length > 0 && (
                  <ul className="mt-3 mb-4 flex flex-col gap-1">
                    {task.subtasks.map((subtask, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        {subtask}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2 mt-3">
                  {!task.completed && (
                    <button
                      onClick={() => completeTask(task._id)}
                      className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Mark complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}