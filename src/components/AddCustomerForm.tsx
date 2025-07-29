import React, { useState } from 'react';

interface AddCustomerFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onCreated, onCancel }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone: '', 
    status: 'lead',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      onCreated();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to add customer');
    }
  }

  return (
    <form className="bg-gray-900 p-2 w-full max-w-md" onSubmit={handleSubmit}>
      <h5 className="text-white mb-4">Add Customer</h5>
      <label className="block text-gray-300 mb-2">First Name</label>
      <input
        name="first_name"
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      <label className="block text-gray-300 mb-2">Last Name</label>
      <input
        name="last_name"
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      <label className="block text-gray-300 mb-2">Email</label>
      <input
        name="email"
        type="email"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
        value={form.email}
        onChange={handleChange}
        required
      />
      <label className="block text-gray-300 mb-2">Address</label>
      <input
        name="address"
        type="text"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
        value={form.address}
        onChange={handleChange}
        placeholder="Street, City, Province, Postal Code"
      />
      <label className="block text-gray-300 mb-2">Phone Number</label>
      <input
        name="phone"
        type="tel"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-3"
        value={form.phone}
        onChange={handleChange}
        placeholder="e.g. (555) 123-4567"
      />
      <label className="block text-gray-300 mb-2">Status</label>
      <select
        name="status"
        className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4"
        value={form.status}
        onChange={handleChange}
      >
        <option value="lead">Lead</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="flex justify-end gap-2">
        <button type="button" className="bg-gray-600 px-3 py-1 rounded text-white cursor-pointer" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="bg-blue-700 px-3 py-1 rounded text-white cursor-pointer" disabled={loading}>
          {loading ? 'Saving...' : 'Add'}
        </button>
      </div>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </form>
  );
};

export default AddCustomerForm;
