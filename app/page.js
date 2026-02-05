'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Todo');
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.title || !newTodo.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/Todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      const data = await response.json();

      setTodos((prev) => [...prev, data.todo]);
      setNewTodo({ title: '', description: '' });
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/Todo?id=${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };

  // Redirect to edit page
  const redirectToEditPage = (id) => {
    router.push(`/Todo/Edit/${id}`);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-400 to-purple-300 py-8 px-4">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Todo List</h1>

        {/* Add Todo Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
  Add New Todo
</h2>


          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
            />

            {/* TEXTAREA */}
            <textarea
              rows={3}
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 resize-none"
            />

            {/* DISABLED + LOADING BUTTON */}
            <button
              onClick={addTodo}
              disabled={isSubmitting}
              className={`w-full text-white p-2 rounded-lg flex items-center justify-center transition
                ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Todo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Todo List */}
        {isLoading ? (
          <p className="text-center text-white">Loading todos...</p>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {todos.map((todo) => (
                <motion.div
                  key={todo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{todo.title}</h3>
                    <p className="text-gray-600">{todo.description}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => redirectToEditPage(todo._id)}
                      className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
