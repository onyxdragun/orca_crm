import React, { useEffect, useState } from 'react';
import AddTaskForm from './NewTaskForm';
import { Task } from '@/types';

interface TicketTaskProps {
  ticketId: number;
}

const TaskList: React.FC<TicketTaskProps> = ({ ticketId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, setTaskTypes] = useState<{id: number, name: string}[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  async function fetchTasks() {
    const res = await fetch(`/api/tickets/${ticketId}/tasks`);
    if (res.ok) {
      setTasks(await res.json());
    }
  }

  useEffect(() => {
    fetchTasks();
    async function fetchTaskTypes() {
      const res = await fetch('/api/task_types');
      if (res.ok) setTaskTypes(await res.json());
    }
    fetchTaskTypes();
    // eslint-disable-next-line
  }, [ticketId]);

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">Tasks</h4>
      <ul className="mb-4">
        {tasks.map(t => (
          <li key={t.id} className="mb-2 border-b border-gray-700 pb-2">
            <div className="text-sm text-gray-200">{t.task_description}</div>
            <div className="text-xs text-gray-400">Type: {t.task_type_id || 'N/A'} &middot; Status: {t.status} &middot; {t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
          </li>
        ))}
        {tasks.length === 0 && <li className="text-gray-400">No tasks yet.</li>}
      </ul>
      {!showAddForm && (
        <button className="bg-blue-700 px-3 py-1 rounded text-white mb-2" onClick={() => setShowAddForm(true)}>
          Add New Task
        </button>
      )}
      {showAddForm && (
        <AddTaskForm ticketId={ticketId} onTaskAdded={() => { setShowAddForm(false); fetchTasks(); }} />
      )}
    </div>
  );
};

export default TaskList;
