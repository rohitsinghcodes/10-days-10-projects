// app/utils/localStorage.js

export const loadTodos = () => {
  try {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTodos = (todos) => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch {}
};
