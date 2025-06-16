'use client';

import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';
import Notification from './components/Notification';

const filters = ['All', 'Pending', 'In-Process', 'Completed'];

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [notification, setNotification] = useState('');
  const [filter, setFilter] = useState('All');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAdd = (title) => {
    const newTodo = {
      id: uuid(),
      title,
      status: 'Pending',
    };
    setTodos([newTodo, ...todos]);
    showNotification('Todo added!');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showNotification('Todo deleted!');
  };

  const handleStatusChange = (id, status) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      )
    );
    showNotification('Status updated!');
  };

  const handleEdit = (id, newTitle) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
    showNotification('Todo updated!');
  };

  const filteredTodos =
    filter === 'All' ? todos : todos.filter((todo) => todo.status === filter);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 mt-6 text-center text-blue-700">
        📝 Daily Task Llist
      </h1>

      <TodoForm onAdd={handleAdd} />

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mt-6 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full border transition-all text-sm ${
              filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo Items */}
      <div className="mt-4 space-y-3">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <Notification message={notification} clear={() => setNotification('')} />
    </>
  );
}
