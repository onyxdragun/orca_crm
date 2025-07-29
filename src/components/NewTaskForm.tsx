import React, { useState, useEffect } from 'react';

interface NewTaskFormProps {
  ticketId: number;
  onTaskAdded: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ ticketId, onTaskAdded }) => {
  const [taskTypeId, setTaskTypeId] = useState<number | ''>('');
  const [taskTypes, setTaskTypes] = useState<{ id: number, name: string }[]>([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTaskTypes() {
      const res = await fetch('/api/task_types');
      if (res.ok) setTaskTypes(await res.json());
    }
    fetchTaskTypes();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/tickets/${ticketId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_type_id: taskTypeId || null,
          task_description: taskDescription,
          status,
        }),
      });
      if (res.ok) {
        setTaskTypeId('');
        setTaskDescription('');
        setStatus('Not Started');
        onTaskAdded();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add task');
      }
    } catch {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 items-center mt-4">
      <select
        value={taskTypeId}
        onChange={e => setTaskTypeId(Number(e.target.value))}
        className="p-2 rounded bg-gray-700 text-white border border-gray-600"
      >
        <option value="">Select type</option>
        {taskTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={taskDescription}
        onChange={e => setTaskDescription(e.target.value)}
        placeholder="Task description"
        className="p-2 rounded bg-gray-700 text-white border border-gray-600 flex-1"
        required
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white border border-gray-600 cursor-pointer"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Blocked">Blocked</option>
      </select>
      <button type="submit" className="bg-green-600 px-3 py-1 rounded text-white cursor-pointer" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </form>
  );
};

export default NewTaskForm;
