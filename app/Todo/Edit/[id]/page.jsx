'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditTodo() {
  const [todo, setTodo] = useState({ title: '', description: '' });
  const router = useRouter();
  const { id } = useParams();
  console.log(id);
  // Fetch todo by ID
  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/Todo/${id}`);
      const data = await response.json();
      setTodo(data.todo);
    } catch (error) {
      toast.error('Failed to fetch todo');
    }
  };

  // Update todo
  const updateTodo = async () => {
    if (!todo.title || !todo.description) {
      toast.error('Title and description are required');
      return;
    }
    try {
      const response = await fetch('/api/Todo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...todo }),
      });
      const data = await response.json();
      toast.success('Todo updated successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Edit Todo</h1>

        {/* Edit Todo Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={todo.title}
              onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={todo.description}
              onChange={(e) => setTodo({ ...todo, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={updateTodo}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Update Todo
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
}