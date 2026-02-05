'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Loader2, Save } from 'lucide-react'; // ✅ import Loader2 & Save icons

export default function EditTodo() {
  const router = useRouter();
  const { id } = useParams();

  const [todo, setTodo] = useState({ title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false); // ✅ define isSaving
  const [isLoading, setIsLoading] = useState(true);

  // Fetch todo by ID
  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/Todo/${id}`);
      const data = await response.json();
      setTodo(data.todo);
    } catch (error) {
      toast.error('Failed to fetch todo');
    } finally {
      setIsLoading(false);
    }
  };

  // Update todo
  const updateTodo = async () => {
    if (!todo.title || !todo.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setIsSaving(true);

      await fetch('/api/Todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...todo }),
      });

      toast.success('Todo updated successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to update todo');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-gray-700" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Edit Todo
        </h1>

        {/* Edit Todo Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              className="w-full p-2 border rounded-lg bg-white text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              rows={4}
              placeholder="Description"
              value={todo.description}
              onChange={(e) =>
                setTodo({ ...todo, description: e.target.value })
              }
              className="w-full p-2 border rounded-lg bg-white text-gray-800 font-medium placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={updateTodo}
              disabled={isSaving}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-2 rounded-lg hover:opacity-90 transition ${
                isSaving ? 'bg-gray-400 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Todo
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
