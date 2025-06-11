import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onDelete, onStatusChange, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleEdit = () => {
    if (editing) onEdit(todo.id, title);
    setEditing(!editing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout
      className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
    >
      <div className="flex flex-col flex-grow">
        {editing ? (
          <input
            className="border px-2 py-1 rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <span className="font-medium">{todo.title}</span>
        )}
        <select
          className="text-sm mt-2 bg-gray-100 px-2 py-1 rounded"
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value)}
        >
          <option>Pending</option>
          <option>In-Process</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="flex gap-2 ml-4">
        <button onClick={handleEdit}><Pencil size={18} /></button>
        <button onClick={() => onDelete(todo.id)}><Trash2 size={18} /></button>
      </div>
    </motion.div>
  );
}
