import React, { useEffect, useState } from 'react';

import { FaCheckCircle, FaBan, FaSpinner, FaHourglassHalf } from 'react-icons/fa';
import { Task } from '@/types';
import Modal from './Modal';

interface TaskListProps {
  ticketId: number;
}

const TaskList: React.FC<TaskListProps> = ({ ticketId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionTaskId, setActionTaskId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<string>('');

  // Edit modal state
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editFields, setEditFields] = useState({
    task_description: '',
    task_type_id: '',
    minutes: '',
    status: '',
    notes: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Task types for dropdown
  const [taskTypes, setTaskTypes] = useState<{ id: number; name: string }[]>([]);

  // Track selected action per task
  const [selectedAction, setSelectedAction] = useState<{ [id: number]: string }>({});

  // Loading state for tasks
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Track expanded task for notes
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  // Complete modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeMinutes, setCompleteMinutes] = useState('');

  async function fetchTasks() {
    setLoadingTasks(true);
    const res = await fetch(`/api/tickets/${ticketId}/tasks`);
    if (res.ok) {
      setTasks(await res.json());
    }
    setLoadingTasks(false);
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [ticketId]);

  useEffect(() => {
    async function fetchTaskTypes() {
      const res = await fetch('/api/task_types');
      if (res.ok) setTaskTypes(await res.json());
    }
    fetchTaskTypes();
  }, []);

  // Handle Delete and Complete actions
  async function handleActionConfirm() {
    if (!actionTaskId || !actionType) return;
    if (actionType === 'delete') {
      await fetch(`/api/tasks/${actionTaskId}`, { method: 'DELETE' });
      setActionTaskId(null);
      setActionType('');
      fetchTasks();
    } else if (actionType === 'complete') {
      setShowCompleteModal(true);
    }
  }

  // Handle complete modal submit
  async function handleCompleteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actionTaskId) return;
    await fetch(`/api/tasks/${actionTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed', minutes: parseInt(completeMinutes) || 0 })
    });
    setShowCompleteModal(false);
    setActionTaskId(null);
    setActionType('');
    setCompleteMinutes('');
    fetchTasks();
  }

  // Open edit modal and populate fields
  function openEditModal(task: Task) {
    setEditTask(task);
    setEditFields({
      task_description: task.task_description,
      task_type_id: task.task_type_id ? String(task.task_type_id) : '',
      minutes: String(task.minutes),
      status: task.status,
      notes: task.notes || '',
    });
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Tasks</h4>
        {!showAddForm && (
          <button className="bg-blue-700 px-3 py-1 rounded text-white cursor-pointer" onClick={() => setShowAddForm(true)}>
            Add Task
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg overflow-hidden border border-gray-700 w-full">
        {/* Mobile: Cards, Desktop: Table */}
        <div className="block md:hidden space-y-4 w-full">
          {loadingTasks ? (
            <div className="text-blue-400 px-4 py-2">Fetching Tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-400 px-4 py-2">No tasks yet.</div>
          ) : (
            tasks.map((t, idx) => (
              <div key={t.id} className={`bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 w-full ${idx % 2 === 0 ? '' : 'bg-gray-700'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white text-lg">{t.task_description}</span>
                  <span className="flex items-center gap-2">
                    {t.status === 'Completed' && <FaCheckCircle className="inline text-green-500" title="Completed" />}
                    {t.status === 'Blocked' && <FaBan className="inline text-red-500" title="Blocked" />}
                    {t.status === 'In Progress' && <FaSpinner className="inline text-blue-400 animate-spin-slow" title="In Progress" />}
                    {t.status === 'Not Started' && <FaHourglassHalf className="inline text-gray-400" title="Not Started" />}
                  </span>
                </div>
                <div className="text-gray-200 mb-1"><strong>Type:</strong> {t.task_type_name || 'N/A'}</div>
                <div className="text-gray-300 mb-1"><strong>Start:</strong> {t.created_at ? new Date(t.created_at).toLocaleString() : ''}</div>
                <div className="text-gray-300 mb-1"><strong>Notes:</strong> {t.notes || 'N/A'}</div>
                <div className="flex justify-end mt-2">
                  <select
                    className="p-1 rounded bg-gray-700 text-white border border-gray-600"
                    value={selectedAction[t.id] || ''}
                    onChange={e => {
                      const value = e.target.value;
                      setSelectedAction(prev => ({ ...prev, [t.id]: value }));
                      if (value === 'edit') {
                        openEditModal(t);
                        setSelectedAction(prev => ({ ...prev, [t.id]: '' }));
                      } else if (value === 'delete' || value === 'complete') {
                        setActionTaskId(t.id);
                        setActionType(value);
                      }
                    }}
                  >
                    <option value="">Actions</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                    <option value="complete">Complete</option>
                  </select>
                  {actionTaskId === t.id && (actionType === 'delete' || actionType === 'complete') && (
                    <div className="absolute bg-gray-900 border border-gray-700 rounded shadow-lg p-4 mt-2 z-10 cursor-pointer">
                      <p className="mb-2 text-white">Are you sure you want to {actionType} this task?</p>
                      <button className="bg-red-600 px-3 py-1 rounded text-white mr-2 cursor-pointer" onClick={() => { handleActionConfirm(); setSelectedAction(prev => ({ ...prev, [t.id]: '' })); }}>Yes</button>
                      <button className="bg-gray-600 px-3 py-1 rounded text-white cursor-pointer" onClick={() => { setActionTaskId(null); setActionType(''); setSelectedAction(prev => ({ ...prev, [t.id]: '' })); }}>No</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <table className="hidden md:table min-w-full bg-gray-800 ">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-2 text-left bg-gray-900 text-gray-300">Description</th>
              <th className="px-4 py-2 text-left bg-gray-900 text-gray-300">Type</th>
              <th className="px-4 py-2 text-center bg-gray-900 text-gray-300">Status</th>
              <th className="px-4 py-2 text-left bg-gray-900 text-gray-300">Start</th>
              <th className="px-4 py-2 text-center bg-gray-900 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingTasks ? (
              <tr><td colSpan={5} className="text-blue-400 px-4 py-2">Fetching Tasks...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan={5} className="text-gray-400 px-4 py-2">No tasks yet.</td></tr>
            ) : (
              tasks.map((t, idx) => (
                <React.Fragment key={t.id}>
                  <tr
                    className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                    onClick={() => setExpandedTaskId(expandedTaskId === t.id ? null : t.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-4 py-2 text-white">{t.task_description}</td>
                    <td className="px-4 py-2 text-gray-200">{t.task_type_name || 'N/A'}</td>
                    <td className="px-4 py-2 text-center">
                      {t.status === 'Completed' && <FaCheckCircle className="inline text-green-500" title="Completed" />}
                      {t.status === 'Blocked' && <FaBan className="inline text-red-500" title="Blocked" />}
                      {t.status === 'In Progress' && <FaSpinner className="inline text-blue-400 animate-spin-slow" title="In Progress" />}
                      {t.status === 'Not Started' && <FaHourglassHalf className="inline text-gray-400" title="Not Started" />}
                    </td>
                    <td className="px-4 py-2 text-gray-300">{t.created_at ? new Date(t.created_at).toLocaleString() : ''}</td>
                    <td className="px-4 py-2">
                      <select
                        className="p-1 rounded bg-gray-700 text-white border border-gray-600"
                        value={selectedAction[t.id] || ''}
                        onChange={e => {
                          const value = e.target.value;
                          setSelectedAction(prev => ({ ...prev, [t.id]: value }));
                          if (value === 'edit') {
                            openEditModal(t);
                            setSelectedAction(prev => ({ ...prev, [t.id]: '' }));
                          } else if (value === 'delete' || value === 'complete') {
                            setActionTaskId(t.id);
                            setActionType(value);
                          }
                        }}
                      >
                        <option value="">Actions</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                        <option value="complete">Complete</option>
                      </select>
                      {actionTaskId === t.id && (actionType === 'delete' || actionType === 'complete') && (
                        <div className="absolute bg-gray-900 border border-gray-700 rounded shadow-lg p-4 mt-2 z-10 cursor-pointer">
                          <p className="mb-2 text-white">Are you sure you want to {actionType} this task?</p>
                          <button className="bg-red-600 px-3 py-1 rounded text-white mr-2 cursor-pointer" onClick={() => { handleActionConfirm(); setSelectedAction(prev => ({ ...prev, [t.id]: '' })); }}>Yes</button>
                          <button className="bg-gray-600 px-3 py-1 rounded text-white cursor-pointer" onClick={() => { setActionTaskId(null); setActionType(''); setSelectedAction(prev => ({ ...prev, [t.id]: '' })); }}>No</button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedTaskId === t.id && t.notes && (
                    <tr>
                      <td colSpan={5} className="bg-gray-900 text-left px-6 py-4 text-gray-200 border-t border-gray-700">
                        <strong>Notes:</strong> {t.notes}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {(showAddForm || editTask) && (
        <Modal isOpen={showAddForm || !!editTask} onClose={() => { setShowAddForm(false); setEditTask(null); }}>
          <form
            className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md"
            onSubmit={async e => {
              e.preventDefault();
              if (editTask) {
                // Edit existing task
                setEditLoading(true);
                setEditError('');
                try {
                  const res = await fetch(`/api/tasks/${editTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      task_description: editFields.task_description,
                      task_type_id: editFields.task_type_id ? Number(editFields.task_type_id) : null,
                      minutes: parseInt(editFields.minutes) || 0,
                      status: editFields.status,
                      notes: editFields.notes,
                    })
                  });
                  if (!res.ok) {
                    const data = await res.json();
                    setEditError(data.error || 'Failed to update task');
                    setEditLoading(false);
                    return;
                  }
                  setEditTask(null);
                  fetchTasks();
                } catch {
                  setEditError('Failed to update task');
                } finally {
                  setEditLoading(false);
                }
              } else {
                // Add new task
                setEditLoading(true);
                setEditError('');
                try {
                  const res = await fetch(`/api/tickets/${ticketId}/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      task_description: editFields.task_description,
                      task_type_id: editFields.task_type_id ? Number(editFields.task_type_id) : null,
                      minutes: parseInt(editFields.minutes) || 0,
                      status: editFields.status,
                      notes: editFields.notes,
                    })
                  });
                  if (!res.ok) {
                    const data = await res.json();
                    setEditError(data.error || 'Failed to add task');
                    setEditLoading(false);
                    return;
                  }
                  setShowAddForm(false);
                  setEditFields({
                    task_description: '',
                    task_type_id: '',
                    minutes: '',
                    status: '',
                    notes: '',
                  });
                  fetchTasks();
                } catch {
                  setEditError('Failed to add task');
                } finally {
                  setEditLoading(false);
                }
              }
            }}
          >
            <h5 className="text-white mb-4">{editTask ? 'Edit Task' : 'Add Task'}</h5>
            <label className="block text-gray-300 mb-2">Description</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
              value={editFields.task_description}
              onChange={e => setEditFields(f => ({ ...f, task_description: e.target.value }))}
              required
            />
            <label className="block text-gray-300 mb-2">Type</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
              value={editFields.task_type_id}
              onChange={e => setEditFields(f => ({ ...f, task_type_id: e.target.value }))}
            >
              <option value="">Select type</option>
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <label className="block text-gray-300 mb-2">Minutes</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
              value={editFields.minutes}
              onChange={e => setEditFields(f => ({ ...f, minutes: e.target.value }))}
              min="0"
              step="1"
            />
            <label className="block text-gray-300 mb-2">Status</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4"
              value={editFields.status}
              onChange={e => setEditFields(f => ({ ...f, status: e.target.value }))}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
            <label className="block text-gray-300 mb-2">Notes</label>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
              value={editFields.notes}
              onChange={e => setEditFields(f => ({ ...f, notes: e.target.value }))}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="bg-gray-600 px-3 py-1 rounded text-white" onClick={() => { setShowAddForm(false); setEditTask(null); }} disabled={editLoading}>Cancel</button>
              <button type="submit" className="bg-blue-700 px-3 py-1 rounded text-white" disabled={editLoading}>
                {editLoading ? (editTask ? 'Saving...' : 'Adding...') : (editTask ? 'Save' : 'Add')}
              </button>
            </div>
            {editError && <div className="text-red-400 mt-2">{editError}</div>}
          </form>
        </Modal>
      )}

      {/* Complete Task Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-30">
          <form className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md" onSubmit={handleCompleteSubmit}>
            <h5 className="text-white mb-4">Log Minutes for Completed Task</h5>
            <label className="block text-gray-300 mb-2">Minutes</label>
            <input
              type="number"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4"
              value={completeMinutes}
              onChange={e => setCompleteMinutes(e.target.value)}
              min="0"
              step="1"
              required
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="bg-gray-600 px-3 py-1 rounded text-white cursor-pointer" onClick={() => { setShowCompleteModal(false); setCompleteMinutes(''); }}>Cancel</button>
              <button type="submit" className="bg-blue-700 px-3 py-1 rounded text-white cursor-pointer">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;
